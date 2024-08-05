import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { Badge, Card, Metric, Title } from '@tremor/react';
import { useState } from 'react';
import { useAutoLoanDisbursal, useLoanDisbursal } from '@/hooks/disbursal-api';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { useFetchLead } from '@/hooks/leads-api';
import {
  enumCleaner,
  formatIndianNumber,
  paymentStatusBadgeColor,
} from '@/utils/utils';
import * as Sentry from '@sentry/react';
import { TbCopy, TbEdit, TbRefresh } from 'react-icons/tb';
import ManualDisbursal from './manual-disbursal-modal';
import AutoDisbursal from './auto-disbursal-modal';
import { useClientAutoDisbursalEnabled } from '@/hooks/clients-api';
import AddUTR from './add-utr-disbursal-modal';
import EditDisbursal from './edit-disbursal-modal';
import { useAuth } from '@/context/AuthContextProvider';
import SecondaryCTA from '@/components/secondary-cta';
import { useLoanData } from '@/hooks/loan-api';
import UpdateDisbursedBy from './update-disbursed-by';
import Tooltip from '@/components/tooltip';

const Disbursal = ({ leadId }: { leadId: string }) => {
  // MANUAL DISBURSAL
  const [manualDisbursalIsOpen, setManualDisbursalIsOpen] = useState(false);
  const [autoDisbursalIsOpen, setAutoDisbursalIsOpen] = useState(false);
  const [addUTRIsOpen, setAddUTRIsOpen] = useState(false);
  const [editDisbursalIsOpen, setEditDisbursalIsOpen] = useState(false);
  const [deleteDisbursalOpen, setDeleteDisbursalOpen] = useState(false);
  const [editDisbursalDate, setEditDisbursalDate] = useState(false);
  const [isEditDisbursedByOpen, setIsEditDisbursedByOpen] = useState(false);
  const [isEditUTROpen, setIsEditUTROpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const { leadData } = useFetchLead({ leadId });
  const { customerData, revalidateCustomerData } = useFetchCustomerByLead({
    leadId,
  });
  const {
    loanDisbursalData,
    revalidateLoanDisbursalData,
    isFetchingLoanDisbursalData,
  } = useLoanDisbursal({
    leadId,
  });
  const { revalidateLoanData } = useLoanData({ leadId });
  const {
    autoLoanDisbursalData,
    isFetchingAutoLoanDisbursalData,
    revalidateAutoLoanDisbursalData,
  } = useAutoLoanDisbursal({ leadId });

  const { clientAutoDisbursalEnabled, isFetchingClientAutoDisbursalEnabled } =
    useClientAutoDisbursalEnabled();

  const shouldAllowDelete = () => {
    if (loanDisbursalData && user?.role !== 'Tele_Caller') {
      if (autoLoanDisbursalData?.status === '') {
        if (customerData?.status === 'Bank_Update') {
          return true;
        } else {
          return false;
        }
      } else if (
        autoLoanDisbursalData?.status === 'FAILED' ||
        autoLoanDisbursalData?.status === 'MANUALLY_REJECTED' ||
        autoLoanDisbursalData?.status === 'REVERSED' ||
        autoLoanDisbursalData?.status === 'APPROVAL_PENDING'
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const updatePaymentStatus = async () => {
    try {
      await axiosInstance.put(`/auto-disbursal/update-transfer-info/${leadId}`);
      toast.success('Status updated!');
      revalidateAutoLoanDisbursalData();
      revalidateCustomerData();
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Could not refresh payment!');
    }
  };

  const deleteDisbursal = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/disbursal/delete-disbursal/${leadId}`);
      revalidateAutoLoanDisbursalData();
      revalidateLoanDisbursalData();
      revalidateLoanData();
      toast.success('Disbursal deleted!');
      setDeleteDisbursalOpen(false);
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      toast.error('Error deleting disbursal!');
      setLoading(false);
    }
  };

  if (
    isFetchingLoanDisbursalData ||
    isFetchingClientAutoDisbursalEnabled ||
    isFetchingAutoLoanDisbursalData
  ) {
    return (
      <Card>
        <p className="text-tremor-title font-semibold">Disbursal Details</p>
        <div className="grid-cols-3 grid mt-6 animate-pulse">
          {Array.from({ length: 12 }, (_, index) => (
            <div className="my-2 flex-col flex" key={index}>
              <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row">
            <p className="text-tremor-title font-semibold mr-2">
              Disbursal Details
            </p>
            <Tooltip
              content={`Want to change the disbursal date or Disbursed By? \n Contact an Admin`}>
              <button
                type="button"
                className="text-white h-6 w-6 flex items-center justify-center hover:bg-gray-400 bg-gray-800 font-medium rounded-full text-base p-3 text-center">
                ?
              </button>
            </Tooltip>
          </div>
          <div className="flex flex-row">
            {!loanDisbursalData &&
              leadData?.status === 'Approved' &&
              clientAutoDisbursalEnabled?.status &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Auto Disbursal"
                  icon="plus"
                  onClick={() => setAutoDisbursalIsOpen(true)}
                  viewStyle="mr-4"
                />
              )}
            {!loanDisbursalData &&
              leadData?.status === 'Approved' &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Manual Disbursal"
                  icon="plus"
                  onClick={() => setManualDisbursalIsOpen(true)}
                />
              )}
            {shouldAllowDelete() && (
              <SecondaryCTA
                ctaText="Delete"
                icon="trash"
                onClick={() => setDeleteDisbursalOpen(true)}
                viewStyle="mr-4"
              />
            )}
            {loanDisbursalData &&
              customerData?.status === 'Bank_Update' &&
              autoLoanDisbursalData?.status === '' &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Update Disbursal Details"
                  icon="plus"
                  onClick={() => setEditDisbursalIsOpen(true)}
                  viewStyle="mr-4"
                />
              )}
            {loanDisbursalData &&
              customerData?.status === 'Bank_Update' &&
              autoLoanDisbursalData?.status !== 'FAILED' &&
              autoLoanDisbursalData?.status !== 'MANUALLY_REJECTED' &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Add UTR"
                  icon="plus"
                  onClick={() => setAddUTRIsOpen(true)}
                />
              )}
          </div>
        </div>
        {!loanDisbursalData ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Loan Disbursal Data Found!
            </Metric>
          </div>
        ) : (
          <div className="grid-cols-3 grid mt-6">
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Disbursal Amount
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(loanDisbursalData.disbursalAmount)}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Company Account No.
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.companyAccountNo}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Account No.
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.accountNo}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                IFSC
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.ifscCode}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Account Type
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.accountType}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Bank Name
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.bankName}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Branch
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.bankBranch}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Cheque No.
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.chequeNo}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Disbursal Date
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {format(
                    parseISO(loanDisbursalData.disbursalDate),
                    'dd-MM-yyyy',
                  )}
                </span>
                {user?.role === 'Admin' && (
                  <TbEdit
                    className="text-primaryColor ml-1 cursor-pointer"
                    onClick={() => {
                      setEditDisbursalIsOpen(true);
                      setEditDisbursalDate(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Final Remark
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.finalRemark}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Disbursed By
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {loanDisbursalData.disbursedBy}
                </span>
                {user?.role === 'Admin' && (
                  <TbEdit
                    className="text-primaryColor ml-1 cursor-pointer"
                    onClick={() => {
                      setIsEditDisbursedByOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                PD Done By
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.pdDoneBy}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                PD Date
              </span>
              <span className="text-sm font-medium">
                {loanDisbursalData.pdDate}
              </span>
            </div>
            {clientAutoDisbursalEnabled &&
            autoLoanDisbursalData &&
            autoLoanDisbursalData.status !== '' ? (
              <>
                {autoLoanDisbursalData.status !== '' && (
                  <>
                    <div className="my-2 flex-col flex">
                      <span className="text-xs font-medium text-gray-400 mb-1">
                        Payment Status
                      </span>

                      <div className="flex flex-row items-center">
                        <span className="text-sm font-medium">
                          <Badge
                            color={paymentStatusBadgeColor(
                              autoLoanDisbursalData.status,
                            )}>
                            {enumCleaner(autoLoanDisbursalData.status)}
                          </Badge>
                        </span>
                        <span>
                          <TbRefresh
                            className="text-primaryColor text-base cursor-pointer ml-4"
                            onClick={updatePaymentStatus}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="my-2 flex-col flex">
                      <span className="text-xs font-medium text-gray-400 mb-1">
                        UTR No.
                      </span>
                      <div className="flex flex-row items-center">
                        <span className="text-sm font-medium">
                          {autoLoanDisbursalData.utr}
                        </span>
                        {autoLoanDisbursalData.utr.length !== 0 && (
                          <span>
                            <TbCopy
                              className="text-primaryColor text-sm cursor-pointer ml-4"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  autoLoanDisbursalData.utr || '',
                                );
                                toast.success('UTRN Copied!');
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  UTR No.
                </span>
                <div className="flex flex-row items-center">
                  <span className="text-sm font-medium">
                    {loanDisbursalData.utrNo}
                  </span>
                  {user?.role === 'Admin' && (
                    <TbEdit
                      className="text-primaryColor ml-1 cursor-pointer"
                      onClick={() => {
                        setIsEditUTROpen(true);
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      {/* MANUAL DISBURSAL FORM */}
      <ModalContainer
        isOpen={manualDisbursalIsOpen}
        onClose={() => setManualDisbursalIsOpen(false)}
        styles="bg-white w-auto">
        <ManualDisbursal
          leadId={leadId}
          setModalOpen={setManualDisbursalIsOpen}
        />
      </ModalContainer>
      <ModalContainer
        isOpen={editDisbursalIsOpen}
        onClose={() => setEditDisbursalIsOpen(false)}
        styles="bg-white w-auto">
        <EditDisbursal
          leadId={leadId}
          setModalOpen={setEditDisbursalIsOpen}
          editDisbursalDate={editDisbursalDate}
        />
      </ModalContainer>
      {/* ADD UTR  FORM */}
      <ModalContainer
        isOpen={addUTRIsOpen}
        onClose={() => setAddUTRIsOpen(false)}
        styles="bg-white w-auto">
        <AddUTR leadId={leadId} setModalOpen={setAddUTRIsOpen} />
      </ModalContainer>
      {/* UPDATE DISBURSED BY */}
      <ModalContainer
        isOpen={isEditDisbursedByOpen}
        onClose={() => setIsEditDisbursedByOpen(false)}
        styles="bg-white w-[60%]">
        <UpdateDisbursedBy leadId={leadId} />
      </ModalContainer>
      {/* UPDATE UTR NO */}
      <ModalContainer
        isOpen={isEditUTROpen}
        onClose={() => setIsEditUTROpen(false)}
        styles="bg-white w-[60%]">
        <AddUTR leadId={leadId} setModalOpen={setIsEditUTROpen} isEdit={true} />
      </ModalContainer>
      {/* AUTO DISBURSAL FORM */}
      <ModalContainer
        isOpen={autoDisbursalIsOpen}
        onClose={() => setAutoDisbursalIsOpen(false)}
        styles="bg-white w-auto">
        <AutoDisbursal leadId={leadId} setModalOpen={setAutoDisbursalIsOpen} />
      </ModalContainer>
      <ModalContainer
        isOpen={deleteDisbursalOpen}
        onClose={() => setDeleteDisbursalOpen(false)}
        styles="bg-white w-auto">
        <>
          <Title className="pb-4">Delete disbursal?</Title>
          <div className="flex items-center justify-between">
            <PrimaryCTA
              ctaText="Yes"
              onClick={deleteDisbursal}
              loading={loading}
              disabled={!!loading}
            />
            <SecondaryCTA
              ctaText="No"
              onClick={() => setDeleteDisbursalOpen(false)}
              viewStyle="ml-4"
              loading={loading}
              disabled={!!loading}
            />
          </div>
        </>
      </ModalContainer>
    </>
  );
};

export default Disbursal;
