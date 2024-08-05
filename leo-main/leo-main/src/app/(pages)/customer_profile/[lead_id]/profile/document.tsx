import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { Badge, Card, Divider, Metric, Title } from '@tremor/react';
import { useCallback, useState } from 'react';
import {
  TbCloudUpload,
  TbDownload,
  TbEdit,
  TbTrash,
  TbX,
} from 'react-icons/tb';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputSelect from '@/components/input-select';
import InputContainer from '@/components/input-container';
import { DocumentTypes } from '@/constants/document-types';
import { VerificationStatus } from '@/constants/verification-status';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { useDocument } from '@/hooks/document-api';
import {
  enumCleaner,
  getUrlExtension,
  getVerificationPillColor,
  updateToCDNUrl,
} from '@/utils/utils';
import TableLoader from '@/components/table-loader';
import Image from 'next/image';
import SecondaryCTA from '@/components/secondary-cta';
import { format, parseISO } from 'date-fns';
import * as Sentry from '@sentry/react';

type DocumentFormType = {
  type: string;
  file: File | undefined;
  pwd: string;
  status: string;
};

type StatusUpdateForm = {
  status: string;
};

const validationSchema = yup.object().shape({
  type: yup.string().required('Document type is required'),
  file: yup.mixed().required('Document file is required'),
  pwd: yup.string(),
  status: yup.string().required('Status is required'),
});

const statusValidationSchema = yup.object().shape({
  status: yup.string().required('Status is required'),
});

const Document = ({ leadId }: { leadId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] =
    useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
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
  const {
    control: statusControl,
    reset: statusReset,
    handleSubmit: statusHandleSubmit,
    formState: { errors: statusErrors },
  } = useForm<StatusUpdateForm>({
    resolver: yupResolver(statusValidationSchema),
  });
  const [loading, setLoading] = useState(false);

  const {
    customerDocumentData,
    isFetchingDocumentData,
    revalidateDocumentData,
  } = useDocument({ leadId });

  const handleFileChange = (file: File | undefined) => {
    setSelectedFile(file);
  };

  const onDrop = useCallback(
    //@ts-ignore
    droppedFiles => {
      setValue('file', droppedFiles[0], { shouldValidate: true });
      handleFileChange(droppedFiles[0]);
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
  });

  const onSubmit = async (data: DocumentFormType) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('document', data.file as File);
      formData.append('documentType', data.type);
      formData.append('password', data.pwd ? data.pwd : '');
      formData.append('status', data.status);
      await axiosInstance.post(`documents/upload/${leadId}`, formData);
      setIsOpen(false);
      revalidateDocumentData();
      reset({
        type: '',
        file: undefined,
        pwd: '',
        status: '',
      });
      toast.success('Document uploaded successfully!');
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      setLoading(true);
      toast.success('Download started!');
      const res = await axiosInstance.get(`/documents/download/${documentId}`);

      // Creating a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = res.data.url;
      link.setAttribute('download', 'filename'); // Optional: Set the default filename for the download

      // Append to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the temporary anchor element
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  const deleteDocument = () => {
    try {
      setLoading(true);
      axiosInstance.post(`documents/delete/${selectedId}`, {});
      revalidateDocumentData();
      setIsConfirmationDialogOpen(false);
      toast.success('Document deleted successfully!');
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  const editStatus = (data: StatusUpdateForm) => {
    try {
      setLoading(true);
      axiosInstance.put(`documents/update/${selectedId}`, {
        status: data.status,
      });
      revalidateDocumentData();
      setIsStatusUpdateDialogOpen(false);
      toast.success('Document deleted successfully!');
      statusReset({
        status: '',
      });
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  if (isFetchingDocumentData) {
    return (
      <Card className="mt-4">
        <TableLoader />
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-tremor-title font-semibold">Document Details</p>
          <PrimaryCTA
            ctaText="Add"
            icon="plus"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
        {customerDocumentData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Document added!
            </Metric>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-col flex-1">
              {customerDocumentData?.map(data => (
                <div
                  key={data.id}
                  className="grid md:grid-cols-7 grid-cols-3 md:gap-0 gap-3 pb-4 border-b-[0.5px] border-dashed border-b-gray-400">
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Document Type
                    </span>
                    <span className="text-sm font-medium">
                      {enumCleaner(data.documentType)}
                    </span>
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Preview
                    </span>
                    {data.documentUrl &&
                    ['.jpeg', '.jpg', '.png'].includes(
                      getUrlExtension(data.documentUrl),
                    ) ? (
                      <div className="h-24 w-32">
                        <Image
                          src={updateToCDNUrl(data.documentUrl)}
                          height={0}
                          width={0}
                          alt={enumCleaner(data.documentType)}
                          sizes="100vw"
                          objectFit="contain"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-medium">No Preview</span>
                    )}
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Password
                    </span>
                    <span className="text-sm font-medium">
                      {data.password === '' ? 'None' : data.password}
                    </span>
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Status
                    </span>
                    <Badge color={getVerificationPillColor(data.status)}>
                      {enumCleaner(data.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Verified By
                    </span>
                    <span className="text-sm font-medium">
                      {data.verifiedBy}
                    </span>
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-1">
                      Verifed On
                    </span>
                    <span className="text-sm font-medium">
                      {data.status === 'Verified'
                        ? format(parseISO(data.verifiedDate), 'dd-MM-yyyy')
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-col mr-4 flex-1">
                    <span className="text-xs font-medium text-gray-400 mb-5"></span>
                    <div className="flex flex-row">
                      <span
                        className="text-xl font-medium cursor-pointer"
                        onClick={async () => handleDownload(data.id)}>
                        <TbDownload />
                      </span>
                      {data.status !== 'Verified' && (
                        <span
                          className="text-xl font-medium cursor-pointer ml-2"
                          onClick={() => {
                            setSelectedId(data.id);
                            setIsStatusUpdateDialogOpen(true);
                          }}>
                          <TbEdit />
                        </span>
                      )}
                      <span
                        className="text-xl font-medium cursor-pointer text-red-500 ml-2"
                        onClick={() => {
                          setSelectedId(data.id);
                          setIsConfirmationDialogOpen(true);
                        }}>
                        <TbTrash />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white md:w-[50%] w-[90%]">
        <Title className="pb-4">Add Document</Title>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputSelect
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
              <InputContainer
                label="Password"
                placeholder="Enter password"
                type="text"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.pwd?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue={VerificationStatus.at(1)?.value}
            render={({ field: { onChange, value } }) => (
              <InputSelect
                label="Status"
                value={value}
                onChange={onChange}
                options={VerificationStatus}
                errorMessage={errors.status?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="flex items-center justify-center w-full">
                {selectedFile ? (
                  <div className="flex flex-col w-full justify-start">
                    <label
                      // htmlFor={id}
                      className="block text-sm font-medium text-gray-700/[0.6] mb-2">
                      File
                    </label>
                    <div className="flex flex-row items-center">
                      <p className="font-light">{selectedFile.name}</p>
                      <span className="ml-2">
                        <TbX
                          className="h-4 w-4 ml-2 cursor-pointer"
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
                    onClick={event => event.stopPropagation()}>
                    <label
                      htmlFor="dropzone-file"
                      className={classNames(
                        errors.file?.message
                          ? 'border-red-500'
                          : 'border-gray-300',
                        isDragActive
                          ? 'border-primaryColor'
                          : 'border-gray-300',
                        'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100',
                      )}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span>
                          <TbCloudUpload className="h-6 w-6 text-semibold text-gray-600" />
                        </span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, VIDEO, ZIP or PDF (MAX. 15MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept=".png, .jpg, .jpeg, .pdf .mp4 .zip"
                        className="hidden"
                        {...getInputProps({})}
                        onChange={event => {
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
        <Divider />
        <div className="w-full justify-end flex mt-4">
          <PrimaryCTA
            ctaText="Submit"
            onClick={handleSubmit(onSubmit)}
            viewStyle=""
            loading={loading}
          />
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        styles="bg-white">
        <Title className="pb-4">Do you want to delete this entry?</Title>
        <div className="flex flex-row justify-end items-center">
          <PrimaryCTA
            ctaText="Yes"
            icon="delete"
            onClick={deleteDocument}
            loading={loading}
          />
          <SecondaryCTA
            ctaText="Cancel"
            viewStyle="ml-2"
            onClick={() => setIsConfirmationDialogOpen(false)}
            disabled={!!loading}
          />
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isStatusUpdateDialogOpen}
        onClose={() => setIsStatusUpdateDialogOpen(false)}
        styles="bg-white">
        <Title className="pb-4">Change Status</Title>
        <Controller
          name="status"
          control={statusControl}
          defaultValue={VerificationStatus.at(1)?.value}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Status"
              value={value}
              onChange={onChange}
              options={VerificationStatus}
              errorMessage={statusErrors.status?.message}
              disabled={!!loading}
            />
          )}
        />
        <Divider />
        <div className="flex flex-row justify-end items-center">
          <PrimaryCTA
            ctaText="Yes"
            icon="edit"
            onClick={statusHandleSubmit(editStatus)}
            loading={loading}
            disabled={!!loading}
          />
          <SecondaryCTA
            ctaText="Cancel"
            viewStyle="ml-2"
            onClick={() => setIsConfirmationDialogOpen(false)}
            disabled={!!loading}
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default Document;
