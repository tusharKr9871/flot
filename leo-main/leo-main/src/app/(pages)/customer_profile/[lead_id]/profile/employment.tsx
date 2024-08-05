import PrimaryCTA from '@/components/primary-cta';
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
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ModalContainer from '@/components/modal';
import InputContainer from '@/components/input-container';
import InputSelect from '@/components/input-select';
import { TbEdit, TbTrash } from 'react-icons/tb';
import {
  EmployerFormType,
  EmployerType,
  useCustomerEmployer,
} from '@/hooks/employer-api';
import TableLoader from '@/components/table-loader';
import { States } from '@/constants/india-states';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import { Experience } from '@/constants/experience';
import { VerificationStatus } from '@/constants/verification-status';
import { getVerificationPillColor, enumCleaner } from '@/utils/utils';
import SecondaryCTA from '@/components/secondary-cta';
import * as Sentry from '@sentry/react';

const validationSchema = yup.object({
  employerName: yup.string().required('Company Name required'),
  totalExperience: yup.string().required('Total Experience required'),
  currentCompanyExperience: yup
    .string()
    .required('Current Company Experience required'),
  address: yup.string().required('Company Address required'),
  city: yup.string().required('City required'),
  state: yup.string().required('State required'),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, 'Invalid Pincode!')
    .required('Pincode required'),
  status: yup.string().required('Status required'),
});

const Employment = ({ leadId }: { leadId: string }) => {
  const { employerData, isFetchingEmployerData, revalidateEmployerData } =
    useCustomerEmployer({ leadId });
  const [isOpen, setIsOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState<EmployerType | null>();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const onEdit = (row: EmployerType) => {
    setDefaultValue(row);
    setIsOpen(true);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/employer/delete/${defaultValue?.id}`);
      revalidateEmployerData();
      toast.success('Employer deleted!');
      setIsConfirmationDialogOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot delete employer!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  if (isFetchingEmployerData) {
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
          <p className="text-tremor-title font-semibold">Employment Details</p>
          <PrimaryCTA
            ctaText="Add"
            icon="plus"
            onClick={() => {
              setDefaultValue(null);
              setIsOpen(true);
            }}
          />
        </div>
        {employerData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Employer added!
            </Metric>
          </div>
        ) : (
          <div className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="bg-white">
                    Company Name
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Current Company Exp.
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Total Exp.
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Address
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">City</TableHeaderCell>
                  <TableHeaderCell className="bg-white">State</TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Pincode
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">Status</TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Verified By
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white"></TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employerData?.map(data => (
                  <TableRow key={data.id}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.currentCompanyExperience}</TableCell>
                    <TableCell>{data.totalExperience}</TableCell>
                    <TableCell>{data.address}</TableCell>
                    <TableCell>{data.city}</TableCell>
                    <TableCell>{data.state}</TableCell>
                    <TableCell>{data.pincode}</TableCell>
                    <TableCell>
                      <Badge color={getVerificationPillColor(data.status)}>
                        {enumCleaner(data.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.verifiedBy}</TableCell>
                    <TableCell className="flex flex-row">
                      {data.status === 'Not_Verified' && (
                        <span
                          className="text-2xl cursor-pointer"
                          onClick={() => onEdit(data)}>
                          <TbEdit />
                        </span>
                      )}
                      <span
                        className="text-2xl ml-2 cursor-pointer text-red-400"
                        onClick={() => {
                          setDefaultValue(data);
                          setIsConfirmationDialogOpen(true);
                        }}>
                        <TbTrash />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white md:w-[50%] w-[90%]">
        <EmploymentForm
          leadId={leadId}
          setIsOpen={setIsOpen}
          defaultValue={defaultValue}
        />
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
            onClick={onDelete}
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

export default Employment;

const EmploymentForm = ({
  defaultValue,
  leadId,
  setIsOpen,
}: {
  defaultValue?: EmployerType | null;
  leadId: string;
  setIsOpen: (val: boolean) => void;
}) => {
  const { revalidateEmployerData } = useCustomerEmployer({ leadId });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployerFormType>({
    resolver: yupResolver(validationSchema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: EmployerFormType) => {
    try {
      setLoading(true);
      if (defaultValue) {
        await axiosInstance.put(`/employer/update/${defaultValue.id}`, data);
      } else {
        await axiosInstance.post(`/employer/add/${leadId}`, data);
      }
      revalidateEmployerData();
      setIsOpen(false);
      reset({
        employerName: '',
        totalExperience: '',
        currentCompanyExperience: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        status: '',
      });
      toast.success('Employer added successfully');
      setLoading(false);
    } catch (error) {
      toast.error('Cannot add employer!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Title className="pb-4">Add Employment Details</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="employerName"
          control={control}
          defaultValue={defaultValue?.name}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Company Name"
              placeholder="Enter company name"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.employerName?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="totalExperience"
          control={control}
          defaultValue={defaultValue?.totalExperience}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Total Experience"
              value={value}
              onChange={onChange}
              options={Experience}
              errorMessage={errors.totalExperience?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="currentCompanyExperience"
          control={control}
          defaultValue={defaultValue?.currentCompanyExperience}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Current Company Experience"
              value={value}
              onChange={onChange}
              options={Experience}
              styles="md:mr-4"
              errorMessage={errors.currentCompanyExperience?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          defaultValue={defaultValue?.address}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Address"
              placeholder="Enter company address"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.address?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="state"
          control={control}
          defaultValue={defaultValue?.state}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="State"
              value={value}
              onChange={onChange}
              options={States}
              styles="md:mr-4"
              errorMessage={errors.state?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          defaultValue={defaultValue?.city}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="City"
              placeholder="Enter city"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.city?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="pincode"
          control={control}
          defaultValue={defaultValue?.pincode}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Pincode"
              placeholder="Enter pincode"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              maxLength={6}
              errorMessage={errors.pincode?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          defaultValue={
            defaultValue ? defaultValue.status : VerificationStatus.at(1)?.value
          }
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
    </>
  );
};
