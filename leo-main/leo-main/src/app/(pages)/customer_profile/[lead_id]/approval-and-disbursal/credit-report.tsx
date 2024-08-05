import React from 'react';
import PrimaryCTA from '@/components/primary-cta';
import { Card, Divider, Metric, Title } from '@tremor/react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalContainer from '@/components/modal';
import NumberInputContainer from '@/components/input-number';
import * as yup from 'yup';
import InputSelect from '@/components/input-select';
import InputContainer from '@/components/input-container';
import SecondaryCTA from '@/components/secondary-cta';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { useCreditReportApi } from '@/hooks/credit-report-api';
import { formatIndianNumber } from '@/utils/utils';
import { useLoanApproval } from '@/hooks/approval-api';
import { useAuth } from '@/context/AuthContextProvider';
import * as Sentry from '@sentry/react';

type LiabilityType = {
  id?: string;
  liabilityName: string;
  debit: number;
  credit?: number;
};

type CreditReportType = {
  firstMonthIncome: number;
  secondMonthIncome?: number;
  thirdMonthIncome?: number;
  bandPercent: string;
  liabilities: LiabilityType[];
};

const liabilitySchema = yup.object().shape({
  liabilityName: yup.string().required('Liability name is required'),
  debit: yup
    .number()
    .typeError('Debit amount must be a number')
    .required('Debit amount is required'),
  credit: yup.number().typeError('Credit amount must be a number'),
});

const validationSchema = yup.object().shape({
  firstMonthIncome: yup.number().required('Required'),
  secondMonthIncome: yup.number(),
  thirdMonthIncome: yup.number(),
  bandPercent: yup.string().required('Required'),
  liabilities: yup.array().of(liabilitySchema).required(),
});

const CreditReport = ({ leadId }: { leadId: string }) => {
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const {
    creditReportData,
    isFetchingCreditReportData,
    revalidateCreditReportData,
  } = useCreditReportApi({ leadId });
  const { loanApprovalData, isFetchingLoanApprovalData } = useLoanApproval({
    leadId,
  });
  const [loading, setLoading] = useState(false);
  const [defaultLiabilites, setDefaultLiabilites] = useState<LiabilityType[]>();
  const [removeLiabilityIds, setRemoveLiabilityIds] = useState<string[]>([]);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreditReportType>({
    resolver: yupResolver<CreditReportType>(validationSchema),
    defaultValues: {
      liabilities: [{ liabilityName: '', debit: 0, credit: 0 }],
    },
  });
  const { user } = useAuth();

  useEffect(() => {
    if (creditReportData?.id) {
      const defaultLiabilites = creditReportData.liabilities.map(liablity => {
        return {
          id: liablity.id,
          liabilityName: liablity.liabilityName,
          debit: liablity.debit,
          credit: liablity.credit,
        };
      });
      setDefaultLiabilites(defaultLiabilites);
      reset({
        liabilities: defaultLiabilites,
      });
    }
  }, [creditReportData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'liabilities',
  });

  const onSubmit = async (data: CreditReportType) => {
    try {
      setLoading(true);
      if (creditReportData) {
        await axiosInstance.put(
          `/credit-report/update/${creditReportData.id}`,
          {
            ...data,
            leadId,
            grossIncome: [
              data.firstMonthIncome,
              data.secondMonthIncome ? data.secondMonthIncome : 0,
              data.thirdMonthIncome ? data.thirdMonthIncome : 0,
            ],
            liabilities: data.liabilities.map(liability => {
              return {
                id: liability.id,
                liabilityName: liability.liabilityName,
                debit: liability.debit,
                credit: liability.credit,
              };
            }),
            bandPercent: parseInt(data.bandPercent),
            removeLiabilityIds,
          },
        );
        toast.success('Credit report updated successfully!');
      } else {
        await axiosInstance.post(`/credit-report/add/${leadId}`, {
          ...data,
          grossIncome: [
            data.firstMonthIncome,
            data.secondMonthIncome ? data.secondMonthIncome : 0,
            data.thirdMonthIncome ? data.thirdMonthIncome : 0,
          ],
          bandPercent: parseInt(data.bandPercent),
        });
        toast.success('Credit report created successfully!');
      }
      reset({
        liabilities: [{ liabilityName: '', debit: 0, credit: 0 }],
        bandPercent: '',
        firstMonthIncome: 0,
        secondMonthIncome: 0,
        thirdMonthIncome: 0,
      });
      setRemoveLiabilityIds([]);
      revalidateCreditReportData();
      setIsCreateReportOpen(false);
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Error creating credit report!');
      setLoading(false);
    }
  };

  if (isFetchingCreditReportData || isFetchingLoanApprovalData) {
    return (
      <Card className="mt-4">
        <p className="text-tremor-title font-semibold">Credit Report</p>
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
      <Card>
        <div className="flex flex-row items-center justify-between">
          <p className="text-tremor-title font-semibold">Credit Report</p>
          <div className="flex flex-row">
            {!creditReportData &&
              !loanApprovalData &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Credit Report"
                  icon="plus"
                  onClick={() => setIsCreateReportOpen(true)}
                  viewStyle="ml-2"
                  loading={loading}
                />
              )}
            {creditReportData && user?.role !== 'Tele_Caller' && (
              <PrimaryCTA
                ctaText="Update"
                icon="plus"
                onClick={() => setIsCreateReportOpen(true)}
                viewStyle="ml-2"
                loading={loading}
              />
            )}
          </div>
        </div>
        {!creditReportData?.id ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Credit Report Data Found!
            </Metric>
          </div>
        ) : (
          <div className="grid-cols-3 grid mt-6">
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Gross Income
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(
                  Math.floor(
                    (creditReportData.grossIncome[0] +
                      creditReportData.grossIncome[1] +
                      creditReportData.grossIncome[2]) /
                      creditReportData.grossIncome.length,
                  ),
                )}
              </span>
            </div>
            <div className="my-2 flex-col flex"></div>
            <div className="my-2 flex-col flex"></div>
            {creditReportData.liabilities.map(liability => (
              <React.Fragment key={liability.id}>
                <div className="my-2 flex-col flex">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Liability Name
                  </span>
                  <span className="text-sm font-medium">
                    {liability.liabilityName}
                  </span>
                </div>
                <div className="my-2 flex-col flex">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Debit
                  </span>
                  <span className="text-sm font-medium">
                    {formatIndianNumber(liability.debit)}
                  </span>
                </div>
                <div className="my-2 flex-col flex">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Credit
                  </span>
                  <span className="text-sm font-medium">
                    {formatIndianNumber(liability.credit)}
                  </span>
                </div>
              </React.Fragment>
            ))}
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Obligation
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(creditReportData.obligation)}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                FOIR Percent
              </span>
              <span className="text-sm font-medium">
                {creditReportData.bandPercent}%
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Foir Score
              </span>
              <span className="text-sm font-medium">
                {creditReportData.foirScore}%
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Net Income
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(creditReportData.netIncome)}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Eligible Amount
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(creditReportData.eligibleAmount)}
              </span>
            </div>
          </div>
        )}
      </Card>
      <ModalContainer
        isOpen={isCreateReportOpen}
        onClose={() => setIsCreateReportOpen(false)}
        styles="bg-white w-auto">
        <Title className="pb-4">Create Credit Report</Title>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="firstMonthIncome"
            control={control}
            defaultValue={creditReportData && creditReportData.grossIncome[0]}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="First Month Income"
                placeholder="Enter 1st month income"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.firstMonthIncome?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="secondMonthIncome"
            control={control}
            defaultValue={creditReportData && creditReportData.grossIncome[1]}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Second Month Income"
                placeholder="Enter 2nd month income"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.firstMonthIncome?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="thirdMonthIncome"
            control={control}
            defaultValue={creditReportData && creditReportData.grossIncome[2]}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Third Month Income"
                placeholder="Enter 3rd month income"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.firstMonthIncome?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="bandPercent"
            control={control}
            defaultValue={
              creditReportData && creditReportData.bandPercent.toString()
            }
            render={({ field: { onChange, value } }) => (
              <InputSelect
                label="FOIR Band"
                value={value}
                onChange={onChange}
                options={[
                  {
                    key: '1',
                    value: '35',
                    label: '35%',
                  },
                  {
                    key: '2',
                    value: '40',
                    label: '40%',
                  },
                  {
                    key: '3',
                    value: '45',
                    label: '45%',
                  },
                  {
                    key: '4',
                    value: '50',
                    label: '50%',
                  },
                ]}
                styles="md:mr-4"
                errorMessage={errors.bandPercent?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        {fields.map((liability, index) => (
          <div className="md:flex flex-row justify-start" key={liability.id}>
            <Controller
              name={`liabilities.${index}.liabilityName`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputContainer
                  label="Liability Name"
                  onChange={onChange}
                  value={value}
                  placeholder="Enter loan/emi name"
                  type="text"
                  styles="md:w-[23.2%] md:mr-4"
                  errorMessage={
                    errors.liabilities?.[index]?.liabilityName?.message
                  }
                  disabled={!!loading}
                />
              )}
            />
            <Controller
              name={`liabilities.${index}.debit`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInputContainer
                  label="Debit"
                  placeholder="Enter debit amount"
                  onChange={onChange}
                  value={value}
                  styles="md:w-[23.2%] md:mr-4"
                  errorMessage={errors.liabilities?.[index]?.debit?.message}
                  disabled={!!loading}
                />
              )}
            />
            <Controller
              name={`liabilities.${index}.credit`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInputContainer
                  label="Credit"
                  placeholder="Enter credit amount"
                  onChange={onChange}
                  value={value}
                  styles="md:w-[23.2%] md:mr-4"
                  errorMessage={errors.liabilities?.[index]?.credit?.message}
                  disabled={!!loading}
                />
              )}
            />
            <div className="md:w-[23.2%] flex flex-row justify-between items-center mt-3">
              <PrimaryCTA
                ctaText="Add"
                onClick={() =>
                  append({ liabilityName: '', debit: 0, credit: 0 })
                }
                icon="plus"
                viewStyle="mr-2"
                disabled={!!loading}
              />
              {
                <SecondaryCTA
                  ctaText="Remove"
                  onClick={() => {
                    if (fields.length === 1) return;
                    else {
                      remove(index);
                    }
                    if (creditReportData) {
                      setRemoveLiabilityIds([
                        ...removeLiabilityIds,
                        defaultLiabilites?.[index].id || '',
                      ]);
                    }
                  }}
                  icon="minus"
                  disabled={!!loading}
                />
              }
            </div>
          </div>
        ))}
        <Divider />
        <div className="w-full justify-end flex">
          <PrimaryCTA
            ctaText={creditReportData ? 'Update' : 'Create'}
            onClick={handleSubmit(onSubmit)}
            viewStyle=""
            loading={loading}
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default CreditReport;
