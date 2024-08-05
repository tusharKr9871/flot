import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { Title, Divider, Card, Metric } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import { TbX, TbCloudUpload, TbTrash, TbEye } from 'react-icons/tb';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { axiosInstance } from '@/network/axiosInstance';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import * as yup from 'yup';
import SecondaryCTA from '@/components/secondary-cta';
import { useFetchCollectionDocument } from '@/hooks/collection-api';
import TableLoader from '@/components/table-loader';
import Image from 'next/image';

type DocumentFormType = {
  file: File | undefined;
};

const validationSchema = yup.object().shape({
  file: yup.mixed().required('Document file is required'),
});

const CollectionDocument = ({ leadId }: { leadId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showCollectionDocument, setShowCollectionDocument] = useState(false);
  const [openDocumentUrl, setOpenDocumentUrl] = useState('');

  const {
    collectionDocument,
    isFetchingCollectionDocument,
    revalidateCollectionDocument,
  } = useFetchCollectionDocument({
    leadId,
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
      await axiosInstance.post(
        `collection/upload-collection-document/${leadId}`,
        formData,
      );
      setIsOpen(false);
      revalidateCollectionDocument();
      reset({
        file: undefined,
      });
      toast.success('Uploaded successfully!');
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
      axiosInstance.delete(
        `collection/delete-collection-document/${selectedId}`,
        {},
      );
      revalidateCollectionDocument();
      setIsConfirmationDialogOpen(false);
      toast.success('Document deleted successfully!');
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  if (isFetchingCollectionDocument) {
    return (
      <Card className="mt-4">
        <TableLoader />
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
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
        {collectionDocument?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Document added!
            </Metric>
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid md:grid-cols-4 grid-cols-2">
              {collectionDocument?.map(data => (
                <div key={data.documentId} className="pb-4">
                  <div className="flex flex-row relative mr-4 h-[256px] w-[128px]">
                    <Image
                      alt="collection-document"
                      src={data.url || ''}
                      height={0}
                      width={0}
                      sizes="100vw"
                      className="rounded-lg"
                      style={{ height: 'auto', width: '100%' }}
                    />
                    <span className="absolute bg-gray-400/40 flex flex-row items-center justify-center h-full w-full rounded-lg">
                      <span
                        className="text-xl font-medium cursor-pointer text-primaryColor"
                        onClick={() => {
                          setShowCollectionDocument(true);
                          setOpenDocumentUrl(data.url);
                        }}>
                        <TbEye />
                      </span>
                      <span
                        className="text-xl font-medium cursor-pointer text-red-500 ml-2"
                        onClick={() => {
                          setSelectedId(data.documentId);
                          setIsConfirmationDialogOpen(true);
                        }}>
                        <TbTrash />
                      </span>
                    </span>
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
        <Title className="pb-4">Add Collection Document</Title>
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
                        <p className="text-xs text-gray-500">PNG, OR JPG</p>
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
        isOpen={showCollectionDocument}
        onClose={() => setShowCollectionDocument(false)}
        styles="bg-white">
        <Title className="pb-4">Collection Document</Title>
        <div className="flex flex-row justify-center items-center">
          <Image
            alt="collection-document"
            src={openDocumentUrl || ''}
            height={0}
            width={0}
            sizes="100vw"
            style={{ height: 'auto', width: '80%' }}
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
    </>
  );
};

export default CollectionDocument;
