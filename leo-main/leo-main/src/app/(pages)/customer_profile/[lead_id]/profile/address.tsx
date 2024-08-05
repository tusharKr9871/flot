import ModalContainer from '@/components/modal';
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputSelect from '@/components/input-select';
import InputContainer from '@/components/input-container';
import {
  CustomerAddressFormType,
  useCustomerAddress,
} from '@/hooks/address-api';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { States } from '@/constants/india-states';
import { enumCleaner, getVerificationPillColor } from '@/utils/utils';
import { TbEdit, TbTrash } from 'react-icons/tb';
import TableLoader from '@/components/table-loader';
import { VerificationStatus } from '@/constants/verification-status';
import SecondaryCTA from '@/components/secondary-cta';
import { HouseType } from '@/constants/house-type';
import Checkbox from '@/components/checkbox';
import * as Sentry from '@sentry/react';

type CustomerAddressDefaultValueType = CustomerAddressFormType & {
  id: string;
};

const validationSchema = yup.object({
  type: yup.string().required('Type required'),
  address: yup.string().required('Address required'),
  city: yup.string().required('City required'),
  state: yup.string().required('State required'),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, 'Only 6 digit numbers allowed')
    .required('Pincode required'),
  houseType: yup.string().required('House Type required'),
  status: yup.string().required('Status required'),
});

const Address = ({ leadId }: { leadId: string }) => {
  const {
    customerAddressData,
    isFetchingCustomerAddress,
    revalidateCustomerAddress,
  } = useCustomerAddress({ leadId });
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [defaultValue, setDefaultValue] =
    useState<CustomerAddressDefaultValueType | null>(null);
  const [loading, setLoading] = useState(false);

  const onEdit = (data: CustomerAddressDefaultValueType) => {
    setDefaultValue(data);
    setIsOpen(true);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/address/delete/${defaultValue?.id}`);
      revalidateCustomerAddress();
      toast.success('Address deleted!');
      setIsConfirmationDialogOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot delete address!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  if (isFetchingCustomerAddress) {
    return (
      <Card className="mt-4">
        <TableLoader />
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex flex-row items-center justify-between">
        <p className="text-tremor-title font-semibold">Address Details</p>
        <PrimaryCTA
          ctaText="Add"
          icon="plus"
          onClick={() => {
            setDefaultValue(null);
            setIsOpen(true);
          }}
        />
      </div>
      {customerAddressData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-48">
          <Metric className="text-3xl font-semibold text-gray-400">
            No Address added!
          </Metric>
        </div>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="bg-white">
                  Address Type
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">Address</TableHeaderCell>
                <TableHeaderCell className="bg-white">City</TableHeaderCell>
                <TableHeaderCell className="bg-white">State</TableHeaderCell>
                <TableHeaderCell className="bg-white">Pincode</TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  House Type
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">Status</TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  Verified By
                </TableHeaderCell>
                <TableHeaderCell className="bg-white"></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerAddressData?.map(data => (
                <TableRow key={data.id}>
                  <TableCell>{enumCleaner(data.type)}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.city}</TableCell>
                  <TableCell>{data.state}</TableCell>
                  <TableCell>{data.pincode}</TableCell>
                  <TableCell>{data.houseType}</TableCell>
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

      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white">
        <AddressForm
          defaultValue={defaultValue}
          leadId={leadId}
          setIsOpen={setIsOpen}
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
    </Card>
  );
};

export default Address;

const AddressForm = ({
  defaultValue,
  leadId,
  setIsOpen,
}: {
  defaultValue?: CustomerAddressDefaultValueType | null;
  leadId: string;
  setIsOpen: (val: boolean) => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CustomerAddressFormType>({
    resolver: yupResolver(validationSchema),
  });
  const { revalidateCustomerAddress } = useCustomerAddress({ leadId });
  const watchAddressType = watch('type');
  const [loading, setLoading] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);

  const onSubmit = async (data: CustomerAddressFormType) => {
    try {
      setLoading(true);
      if (defaultValue) {
        await axiosInstance.put(`/address/update/${defaultValue.id}`, data);
      } else {
        await axiosInstance.post(`/address/add/${leadId}`, {
          ...data,
          isChecked: checkboxValue,
        });
      }
      revalidateCustomerAddress();
      setIsOpen(false);
      reset({
        type: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        houseType: '',
        status: '',
      });
      setCheckboxValue(false);
      setLoading(false);
      toast.success(defaultValue ? 'Address updated!' : 'Address added!');
    } catch (error) {
      //@ts-ignore
      if (error.response.data.message === 'Address already exists!') {
        toast.error('Address type already added!');
      } else {
        toast.error('Cannot add address!');
      }
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  const AddressType = [
    {
      key: '1',
      value: 'Permanent_Address',
      label: 'Permanent Address',
    },
    {
      key: '2',
      value: 'Current_Address',
      label: 'Current Address',
    },
  ];

  return (
    <div className="md:min-w-[512px]">
      <Title className="pb-4">
        {defaultValue ? 'Update Address' : 'Add Address'}
      </Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="type"
          control={control}
          defaultValue={defaultValue?.type}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Type"
              value={value}
              onChange={onChange}
              options={AddressType}
              styles="md:mr-4"
              errorMessage={errors.type?.message}
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
              placeholder="Enter address"
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
              placeholder="Enter City"
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
              maxLength={6}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.pincode?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="houseType"
          control={control}
          defaultValue={defaultValue?.houseType}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="House Type"
              value={value}
              onChange={onChange}
              options={HouseType}
              errorMessage={errors.houseType?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
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
              styles="w-[48%]"
            />
          )}
        />
      </div>
      {watchAddressType && (
        <Checkbox
          label={`${AddressType.filter(addressType => {
            return addressType.value !== watchAddressType;
          }).at(0)?.label} is same as ${enumCleaner(watchAddressType)}`}
          onChange={() => setCheckboxValue(!checkboxValue)}
          value={checkboxValue}
        />
      )}
      <Divider className="mt-4" />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText={defaultValue ? 'Update' : 'Add'}
          onClick={handleSubmit(onSubmit)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </div>
  );
};
