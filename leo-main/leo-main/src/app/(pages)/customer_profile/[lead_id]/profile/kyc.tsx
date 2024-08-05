import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import {
  ESignDocRequestType,
  KYCDataType,
  useESignDocs,
  useKYCFiles,
  useVideoKYC,
} from '@/hooks/kyc-api';
import { axiosInstance } from '@/network/axiosInstance';
import {
  Badge,
  Card,
  Metric,
  Subtitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TbDownload, TbEye, TbTrash } from 'react-icons/tb';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';
import { useLoanApproval } from '@/hooks/approval-api';
import { useCustomerAddress } from '@/hooks/address-api';
import * as Sentry from '@sentry/react';
import SecondaryCTA from '@/components/secondary-cta';

const KYC = ({ leadId }: { leadId: string }) => {
  const [loading, setLoading] = useState(false);
  const [eSignLoading, setESignLoading] = useState(false);
  const [kycDetailsModalOpen, setKycDetailsModalOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [defaultKYCValue, setDefaultKYCValue] = useState<KYCDataType | null>();
  const [isOpenESignDelete, setIsOpenESignDelete] = useState(false);
  const [defaultESignValue, setDefaultESignValue] =
    useState<ESignDocRequestType | null>();

  const { kycData, revalidateKycData, isFetchingKycData } = useVideoKYC({
    leadId,
  });
  const { eSignDocsData, revalidateESignDocsData, isFetchingESignDocsData } =
    useESignDocs({ leadId });

  const { loanApprovalData, isFetchingLoanApprovalData } = useLoanApproval({
    leadId,
  });
  const { customerAddressData, isFetchingCustomerAddress } = useCustomerAddress(
    { leadId },
  );

  const requestKyc = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/kyc/request/${leadId}`);
      toast.success('KYC request sent!');
      revalidateKycData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error sending KYC request!');
      Sentry.captureException(error);
    }
  };

  const requestESignAgreement = async () => {
    try {
      setESignLoading(true);
      await axiosInstance.post(`/kyc/request-e-sign/${leadId}`);
      toast.success('Agreement Signing request sent!');
      revalidateESignDocsData();
      setESignLoading(false);
    } catch (error) {
      setESignLoading(false);
      toast.error('Error sending KYC request!');
      Sentry.captureException(error);
    }
  };

  const downloadFile = async () => {
    try {
      const signedDoc = await axiosInstance.get(
        `/kyc/download-e-sign-doc/${leadId}`,
        {
          responseType: 'arraybuffer',
        },
      );
      const blob = new Blob([signedDoc.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      // Create a link element
      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = 'signed-doc.pdf';
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      URL.revokeObjectURL(blobUrl);
      toast.success('File downloaded started!');
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Error downloading file!');
    }
  };

  const onDeleteKYC = async () => {
    try {
      setIsOpenDelete(false);
      setLoading(true);
      await axiosInstance.delete(`/kyc/delete-kyc/${defaultKYCValue?.id}`);
      toast.success('KYC request deleted!');
      revalidateKycData();
      setLoading(false);
      setDefaultKYCValue(null);
    } catch (error) {
      setLoading(false);
      toast.error('Error deleting KYC request!');
      Sentry.captureException(error);
    }
  };

  const onDeleteESign = async () => {
    try {
      setIsOpenDelete(false);
      setESignLoading(true);
      await axiosInstance.delete(`/kyc/delete-e-sign/${defaultESignValue?.id}`);
      toast.success('E-Sign request deleted!');
      revalidateESignDocsData();
      setESignLoading(false);
      setDefaultESignValue(null);
    } catch (error) {
      setESignLoading(false);
      toast.error('Error deleting E-Sign request!');
      Sentry.captureException(error);
    }
  };

  if (
    isFetchingKycData ||
    isFetchingLoanApprovalData ||
    isFetchingCustomerAddress ||
    isFetchingESignDocsData
  ) {
    return (
      <Card className="mt-4 animate-pulse">
        <div className="flex flex-row items-start justify-between">
          <div className="h-4 bg-gray-200 rounded-full mb-2 w-4/5"></div>
        </div>
        <div className="mt-6">
          <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-2"></div>
          <div className="h-2.5 bg-gray-200 rounded-full mb-4 w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-2"></div>
          <div className="h-2.5 bg-gray-200 rounded-full mb-4 w-4/5"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-row items-start justify-between">
          <p className="text-tremor-title font-semibold">KYC Details</p>
        </div>
        <div className="mt-6">
          <div className="flex flex-col mb-4">
            <div className="flex flex-row items-center justify-between">
              <span className="text-lg font-medium text-gray-400 mb-4">
                Video KYC
              </span>
              <PrimaryCTA
                ctaText="Request Video KYC"
                icon="video"
                onClick={requestKyc}
                loading={loading}
                disabled={
                  !!loading ||
                  eSignLoading ||
                  (!!kycData && kycData.status === 'approved') ||
                  kycData?.status === 'requested'
                }
              />
            </div>
            {!kycData ? (
              <span className="text-sm font-medium">No Data Available</span>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="bg-white"></TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Status
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      KYC Request Id
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Request Date
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Requested By
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {kycData.status === 'requested' && (
                        <span
                          className="text-2xl text-red-600"
                          onClick={() => {
                            setIsOpenDelete(true);
                            setDefaultKYCValue(kycData);
                          }}>
                          <TbTrash />
                        </span>
                      )}
                      {kycData.status !== 'requested' && (
                        <span className="">
                          <TbEye
                            className="h-6 w-6 cursor-pointer text-primaryColor"
                            onClick={() => setKycDetailsModalOpen(true)}
                          />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          kycData.status === 'requested'
                            ? 'yellow'
                            : kycData.status === 'approved'
                            ? 'green'
                            : kycData.status === 'approval_pending'
                            ? 'yellow'
                            : 'red'
                        }>
                        {kycData.status.charAt(0).toUpperCase() +
                          kycData.status.slice(1).replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{kycData.kycRequestId}</TableCell>
                    <TableCell>
                      {format(parseISO(kycData.requestDate), 'dd-MM-yyyy')}
                    </TableCell>
                    <TableCell>{kycData.requestedBy}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex flex-row items-center justify-between">
              <span className="text-lg font-medium text-gray-400 mb-4">
                E Sign Documents
              </span>
              <PrimaryCTA
                ctaText="Request E-Agreement"
                icon="document"
                onClick={requestESignAgreement}
                loading={eSignLoading}
                disabled={
                  !!loading ||
                  !!eSignLoading ||
                  !loanApprovalData ||
                  customerAddressData?.length === 0 ||
                  !!eSignDocsData
                }
              />
            </div>
            {!eSignDocsData ? (
              <span className="text-sm font-medium">No Data Available</span>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="bg-white"></TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Status
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Filename
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Request Date
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-white">
                      Requested By
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {eSignDocsData.status !== 'requested' &&
                        eSignDocsData.status !== 'expired' && (
                          <span className="">
                            <TbDownload
                              className="h-6 w-6 cursor-pointer text-primaryColor"
                              onClick={downloadFile}
                            />
                          </span>
                        )}
                      {eSignDocsData.status === 'requested' && (
                        <span
                          className="text-2xl text-red-600"
                          onClick={() => {
                            setIsOpenESignDelete(true);
                            setDefaultESignValue(eSignDocsData);
                          }}>
                          <TbTrash />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          eSignDocsData.status === 'requested'
                            ? 'yellow'
                            : eSignDocsData.status === 'completed'
                            ? 'green'
                            : 'red'
                        }>
                        {eSignDocsData.status === 'requested'
                          ? 'Requested'
                          : eSignDocsData.status === 'completed'
                          ? 'Signed'
                          : 'Expired'}
                      </Badge>
                    </TableCell>
                    <TableCell>{eSignDocsData.filename}</TableCell>
                    <TableCell>
                      {format(
                        parseISO(eSignDocsData.requestDate),
                        'dd-MM-yyyy',
                      )}
                    </TableCell>
                    <TableCell>{eSignDocsData.requestedBy}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </Card>
      <ModalContainer
        isOpen={kycDetailsModalOpen}
        onClose={() => setKycDetailsModalOpen(false)}
        backdropCloseEnabled={true}
        styles="bg-white w-[75%] h-auto">
        {kycData && <KycRequestDetails kycData={kycData} leadId={leadId} />}
      </ModalContainer>
      <ModalContainer
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        styles="bg-white">
        <div>
          <Title className="pb-4">Do you want to delete this entry?</Title>
          <div className="flex flex-row justify-end items-center">
            <PrimaryCTA
              ctaText="Yes"
              icon="delete"
              onClick={onDeleteKYC}
              loading={loading}
              disabled={!!loading}
            />
            <SecondaryCTA
              ctaText="Cancel"
              viewStyle="ml-2"
              onClick={() => setIsOpenDelete(false)}
              disabled={!!loading}
            />
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isOpenESignDelete}
        onClose={() => setIsOpenESignDelete(false)}
        styles="bg-white">
        <div>
          <Title className="pb-4">Do you want to delete this entry?</Title>
          <div className="flex flex-row justify-end items-center">
            <PrimaryCTA
              ctaText="Yes"
              icon="delete"
              onClick={onDeleteESign}
              loading={loading}
              disabled={!!loading}
            />
            <SecondaryCTA
              ctaText="Cancel"
              viewStyle="ml-2"
              onClick={() => setIsOpenDelete(false)}
              disabled={!!loading}
            />
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default KYC;

const KycRequestDetails = ({
  kycData,
  leadId,
}: {
  kycData: KYCDataType;
  leadId: string;
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [aadharFrontUrl, setAadharFrontUrl] = useState('');
  const [aadharBackUrl, setAadharBackUrl] = useState('');
  const [panUrl, setPanUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { revalidateKycData } = useVideoKYC({ leadId });

  const { kycFileData, isFetchingKycFileData } = useKYCFiles({
    fileId: kycData.videoFileId,
    fileType: 'VIDEO',
  });

  const {
    kycFileData: aadharFrontFileData,
    isFetchingKycFileData: isFetchingAadharFrontFileData,
  } = useKYCFiles({
    fileId: kycData.frontAadharFileId,
    fileType: 'IMAGE',
  });

  const {
    kycFileData: aadharBackFileData,
    isFetchingKycFileData: isFetchingAadharBackFileData,
  } = useKYCFiles({
    fileId: kycData.backAadharFileId,
    fileType: 'IMAGE',
  });

  const {
    kycFileData: panFileData,
    isFetchingKycFileData: isFetchingPanFileData,
  } = useKYCFiles({
    fileId: kycData.panCardFileId,
    fileType: 'IMAGE',
  });

  const updateKycRequest = async (status: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/kyc/approve-kyc/${kycData.kycRequestId}`, {
        status,
      });
      revalidateKycData();
      toast.success('KYC request updated!');
      setLoading(false);
    } catch (error) {
      toast.error('Error updating KYC request!');
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    const convertBlobToVideo = () => {
      try {
        if (kycFileData) {
          const videoBlob = new Blob([kycFileData], { type: 'video/mp4' });
          const blobUrl = URL.createObjectURL(videoBlob);
          setVideoUrl(blobUrl);

          // Cleanup URL when the component unmounts
          return () => URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        console.error('Error processing video data:', error);
      }
    };
    convertBlobToVideo();
  }, [kycFileData]);

  useEffect(() => {
    const converBlobToImage = () => {
      try {
        if (aadharFrontFileData) {
          const imageBlob = new Blob([aadharFrontFileData], {
            type: 'image/png',
          });
          const blobUrl = URL.createObjectURL(imageBlob);
          setAadharFrontUrl(blobUrl);

          // Cleanup URL when the component unmounts
          return () => URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        console.error('Error processing image data:', error);
      }
    };
    converBlobToImage();
  }, [aadharFrontFileData]);

  useEffect(() => {
    const converBlobToImage = () => {
      try {
        if (aadharBackFileData) {
          const imageBlob = new Blob([aadharBackFileData], {
            type: 'image/png',
          });
          const blobUrl = URL.createObjectURL(imageBlob);
          setAadharBackUrl(blobUrl);

          // Cleanup URL when the component unmounts
          return () => URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        console.error('Error processing image data:', error);
      }
    };
    converBlobToImage();
  }, [aadharBackFileData]);

  useEffect(() => {
    const converBlobToImage = () => {
      try {
        if (panFileData) {
          const imageBlob = new Blob([panFileData], { type: 'image/png' });
          const blobUrl = URL.createObjectURL(imageBlob);
          setPanUrl(blobUrl);

          // Cleanup URL when the component unmounts
          return () => URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        console.error('Error processing image data:', error);
      }
    };
    converBlobToImage();
  }, [panFileData]);

  return (
    <div className="pb-12">
      <div className="flex flex-row justify-between">
        <Metric>KYC Details</Metric>
        <div className="flex flex-row">
          <PrimaryCTA
            ctaText="Approve"
            onClick={async () => updateKycRequest('approved')}
            disabled={!!loading || kycData.status !== 'approval_pending'}
            viewStyle="mr-4"
          />
          <SecondaryCTA
            ctaText="Reject"
            onClick={async () => updateKycRequest('rejected')}
            disabled={!!loading || kycData.status !== 'approval_pending'}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 mt-4">
        <div className="flex flex-col mb-4">
          <span className="text-xs font-medium text-gray-400 mb-2">
            KYC Request Id
          </span>
          <span className="text-sm font-medium">{kycData.kycRequestId}</span>
        </div>
        <div className="flex flex-col mb-4">
          <span className="text-xs font-medium text-gray-400 mb-2">Status</span>
          <span>
            <Badge
              color={
                kycData.status === 'requested'
                  ? 'yellow'
                  : kycData.status === 'approved'
                  ? 'green'
                  : kycData.status === 'approval_pending'
                  ? 'yellow'
                  : 'red'
              }>
              {kycData.status.charAt(0).toUpperCase() +
                kycData.status.slice(1).replace(/_/g, ' ')}
            </Badge>
          </span>
        </div>
        <div className="flex flex-col mb-4">
          <span className="text-xs font-medium text-gray-400 mb-2">
            Customer Name
          </span>
          <span className="text-sm font-medium">{kycData.aadharName}</span>
        </div>
        <div className="flex flex-col mb-4">
          <span className="text-xs font-medium text-gray-400 mb-2">
            Id&apos;s Found
          </span>
          <span className="text-sm font-medium">{kycData.idTypes}</span>
        </div>
        <div className="flex flex-col mb-4">
          <span className="text-xs font-medium text-gray-400 mb-2">
            Request Date
          </span>
          <span className="text-sm font-medium">
            {format(parseISO(kycData.requestDate), 'dd-MM-yyyy')}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Subtitle>Video Kyc</Subtitle>
        <div className="flex flex-row items-start justify-start mt-4">
          {isFetchingKycFileData ? (
            <div className="h-[150px] w-[100px] bg-gray-200 rounded-lg"></div>
          ) : (
            <ReactPlayer
              url={videoUrl}
              height={150}
              width={100}
              controls={true}
              style={{ borderRadius: 8 }}
              config={{
                file: {
                  attributes: {
                    controlsList: 'download',
                  },
                },
              }}
            />
          )}
          <div className="flex flex-col mb-4 ml-12">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Geolocation
            </span>
            <span className="text-sm font-medium">{kycData.kycLocation}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pb-4">
        <Subtitle>Aadhaar</Subtitle>
        <div className="grid grid-cols-3 mt-4">
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Id No
            </span>
            <span className="text-sm font-medium">{kycData.aadharNo}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">Name</span>
            <span className="text-sm font-medium">{kycData.aadharName}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Father&apos;s Name
            </span>
            <span className="text-sm font-medium">
              {kycData.aadharFatherName}
            </span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Date of Birth
            </span>
            <span className="text-sm font-medium">{kycData.aadharDob}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Address
            </span>
            <span className="text-sm font-medium">{kycData.aadharAddress}</span>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between mt-4">
          {isFetchingAadharFrontFileData && !aadharFrontUrl ? (
            <div className="h-[300px] w-[48%] bg-gray-200 rounded-lg flex-1"></div>
          ) : (
            <div className="h-[300px] w-[48%]">
              <Image
                alt="front-aadhar"
                src={aadharFrontUrl}
                height={0}
                width={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
              />
              <span className="text-xs font-medium text-gray-400 mb-2s">
                Aadhar Front
              </span>
            </div>
          )}
          {isFetchingAadharBackFileData && !aadharBackUrl ? (
            <div className="h-[300px] w-[48%] bg-gray-200 rounded-lg flex-1"></div>
          ) : (
            <div className="h-[300px] w-[48%]">
              <Image
                alt="back-aadhar"
                src={aadharBackUrl}
                height={0}
                width={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
              />
              <span className="text-xs font-medium text-gray-400 mb-2">
                Aadhar Back
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="pt-4">
        <Subtitle>PAN</Subtitle>
        <div className="grid grid-cols-3 mt-4">
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Id No
            </span>
            <span className="text-sm font-medium">{kycData.panNo}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">Name</span>
            <span className="text-sm font-medium">{kycData.panName}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Father&apos;s Name
            </span>
            <span className="text-sm font-medium">{kycData.panFatherName}</span>
          </div>
          <div className="flex flex-col mb-4">
            <span className="text-xs font-medium text-gray-400 mb-2">
              Date of Birth
            </span>
            <span className="text-sm font-medium">{kycData.panDob}</span>
          </div>
        </div>
        {isFetchingPanFileData && !panUrl ? (
          <div className="h-[300px] w-[48%] bg-gray-200 rounded-lg flex-1"></div>
        ) : (
          <div className="h-[300px] w-[48%]">
            <Image
              alt="pan-card"
              src={panUrl}
              height={0}
              width={0}
              sizes="100vw"
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
            <span className="text-xs font-medium text-gray-400 pb-2">
              Pan Card
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
