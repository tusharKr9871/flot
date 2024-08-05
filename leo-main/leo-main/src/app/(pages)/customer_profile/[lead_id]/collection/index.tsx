'use client';

import DateSelect from '@/components/date-select';
import InputContainer from '@/components/input-container';
import NumberInputContainer from '@/components/input-number';
import InputSelect from '@/components/input-select';
import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import TableLoader from '@/components/table-loader';
import TimePicker from '@/components/time-picker';
import { CollectionMode } from '@/constants/collection-mode';
import { CollectionStatus } from '@/constants/collection-status';
import { useCallHistory } from '@/hooks/call-history-api';
import {
  CollectionDetailsFormType,
  collectionDataType,
  useCollection,
  useFetchExtensionAmount,
} from '@/hooks/collection-api';
import { useFetchLead } from '@/hooks/leads-api';
import { axiosInstance } from '@/network/axiosInstance';
import {
  enumCleaner,
  formatIndianNumber,
  selectPillColor,
} from '@/utils/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Badge,
  Card,
  Divider,
  Metric,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import * as Sentry from '@sentry/react';
import CollectionTimeline from './collection-timeline';
import { TbTrash } from 'react-icons/tb';
import SecondaryCTA from '@/components/secondary-cta';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { useAuth } from '@/context/AuthContextProvider';
import CollectionDocument from './collection-document';
import Tooltip from '@/components/tooltip';
import classNames from 'classnames';

type mailFormType = {
  amount: number;
};
const mailFormValidationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount is required')
    .required('Amount is required'),
});

const collectionDetailsValidationSchema = yup.object().shape({
  collectionAmount: yup
    .number()
    .typeError('Collection amount needs to be a number!')
    .required('Collection Amount is required'),
  penaltyAmount: yup
    .number()
    .typeError('Penalty Amount needs to be a number!')
    .required('Penalty Amount is required'),
  collectionMode: yup.string().required('Collection Mode is required!'),
  referenceNo: yup.string().required('Reference No. is required!'),
  collectedDate: yup.date().required('Collection Date is required!'),
  collectionTime: yup.string(),
  discountAmount: yup
    .number()
    .typeError('Discount Amount needs to be a number!')
    .required('Discount Amount is required'),
  settlementAmount: yup
    .number()
    .typeError('Settlement Amount needs to be a number!')
    .required('Settlement Amount is required'),
  status: yup.string().required('Status is required'),
  remarks: yup.string().required('Remarks is required!'),
});

const Collection = ({ leadId }: { leadId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [defaultValue, setDefaultValue] = useState<collectionDataType>();
  const [isOpenClosedMail, setIsOpenClosedMail] = useState(false);
  const [isOpenNOCMail, setIsOpenNOCMail] = useState(false);
  const [isOpenSettlementMail, setIsOpenSettlementMail] = useState(false);
  const [loading, setLoading] = useState(false);

  const { collectionData, isFetchingCollectionData, revalidateCollectionData } =
    useCollection({ leadId });
  const { revalidateCustomerData } = useFetchCustomerByLead({ leadId });
  const { leadData } = useFetchLead({ leadId });
  const { revalidateCallHistory } = useCallHistory({ leadId });
  const { extensionAmount, isFetchingExtensionAmount } =
    useFetchExtensionAmount({ leadId });
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionDetailsFormType>({
    resolver: yupResolver(collectionDetailsValidationSchema),
  });

  const {
    control: sendMailControl,
    handleSubmit: mailFormHandleSubmit,
    reset: mailFormReset,
    formState: { errors: mailFormErrors },
  } = useForm<mailFormType>({
    resolver: yupResolver(mailFormValidationSchema),
  });

  const onSubmit = async (data: CollectionDetailsFormType) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/collection/add/${leadId}`, {
        ...data,
        collectedDate: format(data.collectedDate, 'dd-MM-yyyy'),
      });
      toast.success('Collection added!');
      revalidateCollectionData();
      revalidateCustomerData();
      revalidateCallHistory();
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Cannot add collection details! Please try again!');
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/collection/delete/${defaultValue?.id}`);
      toast.success('Collection Deleted!');
      revalidateCollectionData();
      revalidateCustomerData();
      revalidateCallHistory();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong!');
    }
  };

  const onSubmitClosedMail = (data: mailFormType) => {
    try {
      setLoading(true);
      axiosInstance.post(`/collection/send-loan-closed-email/${leadId}`, {
        ...data,
      });
      mailFormReset({
        amount: NaN,
      });
      toast.success('Closing mail sent!');
      setLoading(false);
      setIsOpenClosedMail(false);
    } catch (e) {
      setLoading(false);
      Sentry.captureException(e);
      toast.error('Cannot send Closing! Please try again!');
    }
  };
  const onSubmitNOCMail = (data: mailFormType) => {
    try {
      setLoading(true);
      axiosInstance.post(`/collection/send-noc/${leadId}`, {
        ...data,
      });
      mailFormReset({
        amount: NaN,
      });
      toast.success('NOC mail sent!');
      setLoading(false);
      setIsOpenNOCMail(false);
    } catch (e) {
      setLoading(false);
      Sentry.captureException(e);
      toast.error('Cannot send NOC! Please try again!');
    }
  };
  const onSubmitSettlementMail = (data: mailFormType) => {
    try {
      setLoading(true);
      axiosInstance.post(`/collection/send-settlement-email/${leadId}`, {
        ...data,
      });
      mailFormReset({
        amount: NaN,
      });
      toast.success('Settlement mail sent!');
      setLoading(false);
      setIsOpenSettlementMail(false);
    } catch (e) {
      setLoading(false);
      Sentry.captureException(e);
      toast.error('Cannot send Settlement! Please try again!');
    }
  };

  if (isFetchingCollectionData || isFetchingExtensionAmount) {
    return (
      <Card>
        <TableLoader />
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <div className="flex flex-col items-start">
          <div className="flex w-full flex-row items-start justify-between">
            <div className="flex flex-row">
              <p className="text-tremor-title font-semibold mr-2">
                Collection Details
              </p>
              <Tooltip
                content={`Made a mistake in collection or closing? \n Contact an Admin to delete the entry`}>
                <button
                  type="button"
                  className="text-white h-6 w-6 flex items-center justify-center hover:bg-gray-400 bg-gray-800 font-medium rounded-full text-base p-3 text-center">
                  ?
                </button>
              </Tooltip>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex flex-row items-center">
                <p className="text-sm font-semibold mr-4">
                  Remaining Interest:
                </p>
                <p className="text-sm">
                  {formatIndianNumber(extensionAmount?.totalInterest || 0)}
                </p>
              </div>
              <div className="flex flex-row items-center">
                <p className="text-sm font-semibold mr-4">
                  Remaining Penalty Interest:
                </p>
                <p className="text-sm">
                  {formatIndianNumber(extensionAmount?.penaltyInterest || 0)}
                </p>
              </div>
              <div className="flex flex-row items-center">
                <p className="text-sm font-semibold mr-4">Approved Amount:</p>
                <p className="text-sm">
                  {formatIndianNumber(extensionAmount?.approvalAmount || 0)}
                </p>
              </div>
              <div className="flex flex-row items-center">
                <p className="text-sm font-semibold mr-4">Extension Amount:</p>
                <p className="text-sm">
                  {formatIndianNumber(extensionAmount?.extensionAmount || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row items-end justify-end mt-4">
            {(leadData?.status === 'Disbursed' ||
              leadData?.status === 'Part_Payment') && (
              <PrimaryCTA
                ctaText="Add"
                icon="plus"
                viewStyle="mr-4"
                onClick={() => setIsOpen(true)}
              />
            )}
            {(leadData?.status === 'Closed' ||
              leadData?.status === 'Part_Payment' ||
              leadData?.status === 'Settlement') && (
              <>
                <PrimaryCTA
                  ctaText="Send NOC"
                  icon="send"
                  onClick={() => {
                    setIsOpenNOCMail(true);
                  }}
                  loading={!!loading}
                  viewStyle="mr-4"
                />
                <PrimaryCTA
                  ctaText="Send Loan Closed Mail"
                  icon="send"
                  onClick={() => {
                    setIsOpenClosedMail(true);
                  }}
                  loading={!!loading}
                  viewStyle="mr-4"
                />
                <PrimaryCTA
                  ctaText="Send Settlement Mail"
                  icon="send"
                  onClick={() => {
                    setIsOpenSettlementMail(true);
                  }}
                  loading={!!loading}
                />
              </>
            )}
          </div>
        </div>
        {!collectionData ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Collection Data Found!
            </Metric>
          </div>
        ) : (
          <div className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  {user?.role === 'Admin' && (
                    <TableHeaderCell className="bg-white"></TableHeaderCell>
                  )}
                  <TableHeaderCell className="bg-white">
                    Loan No
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">Amount</TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Reference No.
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Payment Mode
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Disc. Amount
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Settlement
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">Status</TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Remarks
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Collected By
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Collection Date
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Collection Time
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Created At
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-slate-600">
                {collectionData.map((data, index) => (
                  <TableRow
                    key={data.id}
                    className={classNames(index % 2 === 0 && 'bg-gray-100')}>
                    {user?.role === 'Admin' && (
                      <TableCell>
                        <span
                          className="text-2xl text-red-600"
                          onClick={() => {
                            setIsOpenDelete(true);
                            setDefaultValue(data);
                          }}>
                          <TbTrash />
                        </span>
                      </TableCell>
                    )}
                    <TableCell>{data.loanNo}</TableCell>
                    <TableCell>
                      {formatIndianNumber(data.collectionAmount)}
                    </TableCell>
                    <TableCell>{data.referenceNo}</TableCell>
                    <TableCell>{data.collectionMode}</TableCell>
                    <TableCell>
                      {formatIndianNumber(data.discountAmount)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(data.settlementAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge color={selectPillColor(enumCleaner(data.status))}>
                        {enumCleaner(data.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.remarks}</TableCell>
                    <TableCell>{data.collectedBy}</TableCell>
                    <TableCell>
                      {format(parseISO(data.collectionDate), 'dd-MM-yyyy')}
                    </TableCell>
                    <TableCell>{data.collectionTime}</TableCell>
                    <TableCell>
                      {format(parseISO(data.createdAt), 'dd-MM-yyyy hh:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      {/* Collection Document Submit */}
      <CollectionDocument leadId={leadId} />
      {/* Collection timeline */}
      <CollectionTimeline leadId={leadId} />
      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white w-auto">
        <Title className="pb-4">Add Collection Details</Title>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="collectionAmount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Collection Amount"
                placeholder="Enter collection amount"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.collectionAmount?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="penaltyAmount"
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Penalty Amount"
                placeholder="Enter penalty amount"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.penaltyAmount?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="collectionMode"
            control={control}
            defaultValue={CollectionMode[0].value}
            render={({ field: { onChange, value } }) => (
              <InputSelect
                label="Collection Mode"
                value={value}
                onChange={onChange}
                options={CollectionMode}
                errorMessage={errors.collectionMode?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="referenceNo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputContainer
                label="Reference Number"
                placeholder="Enter reference number"
                type="text"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.referenceNo?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="collectedDate"
            control={control}
            defaultValue={new Date()}
            render={({ field: { onChange, value } }) => (
              <DateSelect
                label="Collection Date"
                placeholder="Select Date"
                value={value}
                onChange={onChange}
                styles="md:mr-4"
                errorMessage={errors.collectedDate?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="collectionTime"
            control={control}
            defaultValue="00:00"
            render={({ field: { onChange, value } }) => (
              <TimePicker
                selectedTime={value || new Date().getTime().toString()}
                setSelectedTime={onChange}
                label="Collection Time"
                errorMessage={errors.collectionTime?.message}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="discountAmount"
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Discount Amount"
                placeholder="Enter discount amount"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.discountAmount?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="settlementAmount"
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Settlement Amount"
                placeholder="Enter settlement amount"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.settlementAmount?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue={CollectionStatus[0].value}
            render={({ field: { onChange, value } }) => (
              <InputSelect
                label="Status"
                value={value}
                onChange={onChange}
                options={CollectionStatus}
                errorMessage={errors.status?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="remarks"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputContainer
                label="Remarks"
                placeholder="Enter remarks.."
                type="text"
                onChange={onChange}
                value={value}
                errorMessage={errors.remarks?.message}
                styles="md:w-1/2"
                disabled={!!loading}
              />
            )}
          />
        </div>
        <Divider />
        <div className="w-full justify-end flex">
          <PrimaryCTA
            ctaText="Submit"
            onClick={handleSubmit(onSubmit)}
            viewStyle=""
            loading={loading}
            disabled={!!loading}
          />
        </div>
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
              onClick={onDelete}
              loading={loading}
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
        isOpen={isOpenClosedMail}
        onClose={() => setIsOpenClosedMail(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="amount"
          control={sendMailControl}
          //defaultValue={loanData?.repaymentAmount}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Closing Amount"
              placeholder="Enter closing amount"
              onChange={onChange}
              value={value}
              errorMessage={mailFormErrors.amount?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Send Closing Mail"
            onClick={mailFormHandleSubmit(onSubmitClosedMail)}
            icon="send"
          />
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isOpenNOCMail}
        onClose={() => setIsOpenNOCMail(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="amount"
          control={sendMailControl}
          //defaultValue={loanData?.repaymentAmount}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="NOC Amount"
              placeholder="Enter NOC mail amount"
              onChange={onChange}
              value={value}
              errorMessage={mailFormErrors.amount?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Send NOC Mail"
            onClick={mailFormHandleSubmit(onSubmitNOCMail)}
            icon="send"
          />
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isOpenSettlementMail}
        onClose={() => setIsOpenSettlementMail(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="amount"
          control={sendMailControl}
          //defaultValue={loanData?.repaymentAmount}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Settlement Amount"
              placeholder="Enter settlement amount"
              onChange={onChange}
              value={value}
              errorMessage={mailFormErrors.amount?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Send settlement Mail"
            onClick={mailFormHandleSubmit(onSubmitSettlementMail)}
            icon="send"
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default Collection;
