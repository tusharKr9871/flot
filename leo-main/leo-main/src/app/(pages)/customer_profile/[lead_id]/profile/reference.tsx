import PrimaryCTA from '@/components/primary-cta';
import {
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import ModalContainer from '@/components/modal';
import InputSelect from '@/components/input-select';
import InputContainer from '@/components/input-container';
import { TbEdit, TbTrash } from 'react-icons/tb';
import {
  ReferenceFormType,
  ReferenceType,
  useReferenceDetails,
} from '@/hooks/reference-api';
import { relations } from '@/constants/relations';
import { States } from '@/constants/india-states';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import TableLoader from '@/components/table-loader';
import SecondaryCTA from '@/components/secondary-cta';
import * as Sentry from '@sentry/react';
import { enumCleaner } from '@/utils/utils';

const validationSchema = yup.object({
  name: yup.string().required('Name required'),
  relation: yup.string().required('Relation required'),
  mobile: yup
    .string()
    .matches(/^\d{10}$/, 'Invalid Phone no.!')
    .required('Phone number required'),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  pincode: yup.string().matches(/^\d{6}$/, 'Invalid Pincode!'),
});

const Reference = ({ leadId }: { leadId: string }) => {
  const { referenceData, isFetchingReferenceData, revalidateReferenceData } =
    useReferenceDetails({ leadId });
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [defaultValue, setDefaultValue] = useState<ReferenceType | null>(null);

  const onEdit = (row: ReferenceType) => {
    setDefaultValue(row);
    setIsOpen(true);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/reference/delete/${defaultValue?.id}`);
      revalidateReferenceData();
      toast.success('Reference deleted!');
      setIsConfirmationDialogOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot delete reference!');
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  if (isFetchingReferenceData) {
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
          <p className="text-tremor-title font-semibold">Reference Details</p>
          <PrimaryCTA
            ctaText="Add"
            icon="plus"
            onClick={() => {
              setIsOpen(true);
              setDefaultValue(null);
            }}
          />
        </div>
        {referenceData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No References added!
            </Metric>
          </div>
        ) : (
          <div className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="bg-white">
                    Full Name
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Relation
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Phone Number
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Address
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">City</TableHeaderCell>
                  <TableHeaderCell className="bg-white">State</TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Pincode
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white"></TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referenceData?.map(data => (
                  <TableRow key={data.id}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{enumCleaner(data.relation)}</TableCell>
                    <TableCell>{data.phoneNo}</TableCell>
                    <TableCell>{data.address ? data.address : 'N/A'}</TableCell>
                    <TableCell>{data.city ? data.city : 'N/A'}</TableCell>
                    <TableCell>{data.state ? data.state : 'N/A'}</TableCell>
                    <TableCell>{data.pincode ? data.pincode : 'N/A'}</TableCell>
                    <TableCell className="flex flex-row">
                      <span
                        className="text-2xl cursor-pointer"
                        onClick={() => onEdit(data)}>
                        <TbEdit />
                      </span>
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
        <ReferenceForm
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

export default Reference;

const ReferenceForm = ({
  defaultValue,
  leadId,
  setIsOpen,
}: {
  defaultValue?: ReferenceType | null;
  leadId: string;
  setIsOpen: (val: boolean) => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferenceFormType>({
    resolver: yupResolver(validationSchema),
  });
  const { revalidateReferenceData } = useReferenceDetails({ leadId });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ReferenceFormType) => {
    try {
      setLoading(true);
      if (defaultValue) {
        await axiosInstance.put(`/reference/update/${defaultValue.id}`, data);
      } else {
        await axiosInstance.post(`/reference/add/${leadId}`, data);
      }
      revalidateReferenceData();
      setIsOpen(false);
      reset({
        name: '',
        relation: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success(defaultValue ? 'Reference updated!' : 'Reference added!');
      setLoading(false);
    } catch (error) {
      toast.error('Error adding reference!');
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  return (
    <>
      <Title className="pb-4">
        {defaultValue ? 'Update Reference' : 'Add Reference'}
      </Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="relation"
          control={control}
          defaultValue={defaultValue?.relation}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Relation"
              value={value}
              onChange={onChange}
              options={relations}
              styles="md:mr-4"
              errorMessage={errors.relation?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          defaultValue={defaultValue?.name}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Full Name"
              placeholder="Enter full name"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.name?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="address"
          control={control}
          defaultValue={defaultValue?.address}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Address (Optional)"
              placeholder="Enter address (optional)"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.address?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          defaultValue={defaultValue?.state}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="State (Optional)"
              value={value || ''}
              onChange={onChange}
              options={States}
              errorMessage={errors.state?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="city"
          control={control}
          defaultValue={defaultValue?.city}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="City (Optional)"
              placeholder="Enter city (optional)"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.city?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pincode"
          control={control}
          defaultValue={defaultValue?.pincode}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Pincode (Optional)"
              placeholder="Enter pincode (optional)"
              type="text"
              onChange={onChange}
              value={value}
              maxLength={6}
              errorMessage={errors.pincode?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="mobile"
          control={control}
          defaultValue={defaultValue?.phoneNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Phone Number"
              placeholder="Enter phone number"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:w-1/2 md:pr-2 w-full"
              maxLength={10}
              errorMessage={errors.mobile?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText={defaultValue ? 'Update' : 'Submit'}
          onClick={handleSubmit(onSubmit)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </>
  );
};
