"use client";

import { enumCleaner, getVerificationPillColor } from "@/utils/util-functions";
import { Title, Metric, Badge, Card } from "@tremor/react";
import { TbCloudUpload, TbDownload, TbX } from "react-icons/tb";

import PrimaryCTA from "../primary-cta";
import { DocumentTypes } from "@/constants/document-types";
import {
  useFetchCustomer,
  useFetchCustomerDocuments,
} from "@/hooks/customer-api";
import { axiosInstance } from "@/network/axiosInstance";
import classNames from "classnames";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import SelectInput from "../select-input";
import TextInputContainer from "../text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContextProvider";
import * as Sentry from "@sentry/nextjs";

type DocumentFormType = {
  type: string;
  file: File | undefined;
  pwd: string;
};

const validationSchema = yup.object().shape({
  type: yup.string().required("Document type is required"),
  file: yup.mixed().required("Document file is required"),
  pwd: yup.string(),
});

const CustomerDocuments = () => {
  const { customerDocumentData, isFetchingCustomerDocumentData } =
    useFetchCustomerDocuments();
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleDownload = (url: string) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  if (isFetchingCustomerDocumentData) {
    return (
      <Card className="px-6 basis-2/4 lg:ml-10 md:ml-6 mt-10 md:mt-0 animate-pulse">
        <div className="mb-4">
          <div className="mb-10">
            <Title>Documents</Title>
            <p className="text-sm text-gray-600 mt-2 font-medium animate-pulse h-2 w-12"></p>
          </div>
          <div className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-6 basis-2/4 lg:ml-10 md:ml-6 mt-10 md:mt-0">
      <Title>Documents</Title>
      {customerDocumentData?.length === 0 ? (
        <div className="mt-4 h-full w-full flex flex-col justify-center items-center rounded-lg">
          {!showUploadForm ? (
            <>
              <Metric className="text-gray-600">No Document Uploaded</Metric>
              <p className="my-4 text-gray-500 text-sm">
                Make your approval seamless by uploading right now
              </p>
              <PrimaryCTA
                ctaText="Upload"
                icon="plus"
                onClick={() => setShowUploadForm(true)}
              />
            </>
          ) : (
            <DocumentUploadForm />
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 mt-4">
          <div className="flex flex-row flex-1 flex-wrap justify-between pb-2 items-center">
            <div className="flex flex-col mr-4 flex-1">
              <span className="text-xs font-medium text-gray-500 mb-1">
                Type
              </span>
            </div>
            <div className="flex flex-col mr-4 flex-1">
              <span className="text-xs font-medium text-gray-500 mb-1">
                Password
              </span>
            </div>
            <div className="flex flex-col mr-4 flex-1">
              <span className="text-xs font-medium text-gray-500 mb-1">
                Status
              </span>
            </div>
            <div className="flex flex-col mr-4 flex-1">
              <span className="text-xs font-medium text-gray-500 mb-1">
                Download
              </span>
            </div>
          </div>
          {customerDocumentData?.map((document) => (
            <div
              key={document.id}
              className="flex flex-row flex-1 flex-wrap justify-between py-4 items-center"
            >
              <div className="flex flex-col mr-4 flex-1">
                <span className="text-sm font-medium">
                  {enumCleaner(document.documentType)}
                </span>
              </div>
              <div className="flex flex-col mr-4 flex-1">
                <span className="text-sm font-medium">
                  {document.password === "" ? "None" : document.password}
                </span>
              </div>
              <div className="flex flex-col mr-4 flex-1">
                <Badge color={getVerificationPillColor(document.status)}>
                  {enumCleaner(document.status)}
                </Badge>
              </div>
              <div className="flex flex-col mr-4 flex-1">
                <span
                  className="text-xl font-medium cursor-pointer"
                  onClick={() => handleDownload(document.documentUrl)}
                >
                  <TbDownload />
                </span>
              </div>
            </div>
          ))}
          <>
            {!showUploadForm && (
              <div className="mt-4 flex flex-row justify-end">
                <PrimaryCTA
                  ctaText="Upload"
                  icon="plus"
                  onClick={() => setShowUploadForm(true)}
                />
              </div>
            )}
            {showUploadForm && (
              <div className="mt-4 flex relative">
                <DocumentUploadForm />
                <span
                  className="absolute top-0 right-0 cursor-pointer"
                  onClick={() => setShowUploadForm(false)}
                >
                  <TbX />
                </span>
              </div>
            )}
          </>
        </div>
      )}
    </Card>
  );
};

export default CustomerDocuments;

const DocumentUploadForm = () => {
  const { revalidateCustomerDocumentData } = useFetchCustomerDocuments();
  const { user } = useAuth();
  const { revalidateCustomerData } = useFetchCustomer({
    userToken: user?.token || "",
  });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormType>({
    //@ts-ignore
    resolver: yupResolver(validationSchema),
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File | undefined) => {
    setSelectedFile(file);
  };

  const onDrop = useCallback(
    //@ts-ignore
    (droppedFiles) => {
      setValue("file", droppedFiles[0], { shouldValidate: true });
      handleFileChange(droppedFiles[0]);
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
  });

  const onSubmit = async (data: DocumentFormType) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("document", data.file as File);
      formData.append("documentType", data.type);
      formData.append("password", data.pwd ? data.pwd : "");
      formData.append("clientId", process.env.NEXT_PUBLIC_CLIENT_ID || "");
      await axiosInstance.post("/customer/upload-documents", formData);
      revalidateCustomerDocumentData();
      revalidateCustomerData();
      reset({
        type: "",
        file: undefined,
        pwd: "",
      });
      toast.success("Document uploaded successfully!");
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="md:flex flex-row justify-between">
        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectInput
              label="Type"
              value={value}
              onChange={onChange}
              options={DocumentTypes}
              styles="md:mr-4"
              errorMessage={errors.type?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pwd"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInputContainer
              label="Password"
              placeholder=""
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.pwd?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="">
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex items-center justify-center w-full">
              {selectedFile ? (
                <div className="flex flex-col w-full justify-start">
                  <label
                    // htmlFor={id}
                    className="block text-sm font-medium text-gray-700/[0.6] mb-2"
                  >
                    File
                  </label>
                  <div className="flex flex-row items-center">
                    <p className="font-light">{selectedFile.name}</p>
                    <span className="ml-2 cursor-pointer">
                      <TbX
                        className="h-4 w-4 ml-2"
                        onClick={() => {
                          reset({
                            file: undefined,
                          });
                          setSelectedFile(undefined);
                        }}
                      />
                    </span>
                  </div>
                  {errors.file?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.file.message}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col w-full"
                  {...getRootProps()}
                  onClick={(event) => event.stopPropagation()}
                >
                  <label
                    htmlFor="dropzone-file"
                    className={classNames(
                      errors.file?.message
                        ? "border-red-500"
                        : "border-gray-300",
                      isDragActive ? "border-primaryColor" : "border-gray-300",
                      "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span>
                        <TbCloudUpload className="h-6 w-6 text-semibold text-gray-600" />
                      </span>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or PDF (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept=".png, .jpg, .jpeg, .pdf"
                      className="hidden"
                      {...getInputProps({})}
                      onChange={(event) => {
                        onChange(event.target.files?.[0]);
                        handleFileChange(event.target.files?.[0]);
                      }}
                    />
                  </label>
                  {errors.file?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.file.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="w-full justify-end flex mt-4">
        <PrimaryCTA
          ctaText="Submit"
          onClick={handleSubmit(onSubmit)}
          viewStyle=""
          loading={loading}
        />
      </div>
    </div>
  );
};
