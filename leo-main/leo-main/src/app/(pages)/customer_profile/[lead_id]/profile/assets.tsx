import ModalContainer from '@/components/modal';
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
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputContainer from '@/components/input-container';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { TbEdit, TbTrash } from 'react-icons/tb';
import TableLoader from '@/components/table-loader';
import SecondaryCTA from '@/components/secondary-cta';
import { CustomerAssetsFormType, useCustomerAssets } from '@/hooks/assets-api';
import { format, parseISO } from 'date-fns';
import * as Sentry from '@sentry/react';

type CustomerAssetsDefaultValueType = CustomerAssetsFormType & {
  id: string;
};

const validationSchema = yup.object({
  assetName: yup.string().required('Asset Name is required'),
  assetValue: yup.string().required('Asset Value is required'),
});

const Assets = ({ leadId }: { leadId: string }) => {
  const {
    customerAssetsData,
    revalidateCustomerAssets,
    isFetchingCustomerAssets,
  } = useCustomerAssets({ leadId });
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [defaultValue, setDefaultValue] =
    useState<CustomerAssetsDefaultValueType | null>(null);
  const [loading, setLoading] = useState(false);

  const onEdit = (data: CustomerAssetsDefaultValueType) => {
    setDefaultValue(data);
    setIsOpen(true);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/customer-asset/delete/${defaultValue?.id}`);
      revalidateCustomerAssets();
      toast.success('Asset deleted!');
      setIsConfirmationDialogOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot delete asset!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  if (isFetchingCustomerAssets) {
    return (
      <Card className="mt-4">
        <TableLoader />
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex flex-row items-center justify-between">
        <p className="text-tremor-title font-semibold">Asset Details</p>
        <PrimaryCTA
          ctaText="Add"
          icon="plus"
          onClick={() => {
            setDefaultValue(null);
            setIsOpen(true);
          }}
        />
      </div>
      {customerAssetsData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-48">
          <Metric className="text-3xl font-semibold text-gray-400">
            No Asset added!
          </Metric>
        </div>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="bg-white">
                  Asset Nmae
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  Asset Value
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  Created At
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  Updated At
                </TableHeaderCell>
                <TableHeaderCell className="bg-white"></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerAssetsData?.map(data => (
                <TableRow key={data.id}>
                  <TableCell>{data.assetName}</TableCell>
                  <TableCell>{data.assetValue}</TableCell>
                  <TableCell>
                    {format(parseISO(data.createdAt), 'dd-MM-yyyy hh:mm:ss')}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(data.updatedAt), 'dd-MM-yyyy hh:mm:ss')}
                  </TableCell>
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

      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white">
        <AssetsForm
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

export default Assets;

const AssetsForm = ({
  defaultValue,
  leadId,
  setIsOpen,
}: {
  defaultValue?: CustomerAssetsDefaultValueType | null;
  leadId: string;
  setIsOpen: (val: boolean) => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerAssetsFormType>({
    resolver: yupResolver(validationSchema),
  });
  const { revalidateCustomerAssets } = useCustomerAssets({ leadId });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CustomerAssetsFormType) => {
    try {
      setLoading(true);
      if (defaultValue) {
        await axiosInstance.put(`/customer-asset/update/`, {
          ...data,
          assetId: defaultValue.id,
        });
      } else {
        await axiosInstance.post(`/customer-asset/add/${leadId}`, data);
      }
      revalidateCustomerAssets();
      setIsOpen(false);
      reset({
        assetName: '',
        assetValue: '',
      });
      setLoading(false);
      toast.success(defaultValue ? 'Asset updated!' : 'Asset added!');
    } catch (error) {
      toast.error('Cannot add asset!');
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  return (
    <div className="md:min-w-[512px]">
      <Title className="pb-4">
        {defaultValue ? 'Update Asset' : 'Add Asset'}
      </Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="assetName"
          control={control}
          defaultValue={defaultValue?.assetName}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Asset Name"
              placeholder="Enter asset name"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.assetName?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="assetValue"
          control={control}
          defaultValue={defaultValue?.assetValue}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Asset Value"
              placeholder=""
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.assetValue?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
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
