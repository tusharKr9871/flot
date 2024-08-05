'use client';

import { useAuth } from '@/context/AuthContextProvider';
import { useClients } from '@/hooks/clients-api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SelectProductPage = () => {
  const { clientsData, isFetchingClientsData } = useClients();
  const router = useRouter();
  const { selectProduct } = useAuth();

  return (
    <div
      className="min-h-screen flex relative overflow-y-hidden bg-cover"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_LOGIN_BG})` }}>
      <div className="w-full flex items-center justify-center">
        <div className="bg-white relative shadow-lg rounded-xl lg:w-[30%] md:w-[40%] sm:w-[50%] w-[60%] px-12 py-8 flex-items-center justify-center flex-col">
          <div className="py-6">
            <div>
              <p className="pt-4 font-medium md:text-lg text-base">
                Select your product
              </p>
              <p className="pt-4 md:text-base text-sm text-gray-400">
                You will be logged into the product you select
              </p>
            </div>
            <div className="flex flex-row mt-4 justify-around">
              {isFetchingClientsData ? (
                <>
                  <div className="flex flex-col justify-center items-center animate-pulse ">
                    <div className="h-24 w-24 rounded-lg border bg-gray-200"></div>
                    <p className="font-semibold text-lg mt-4 h-4 w-14 bg-gray-200"></p>
                  </div>
                  <div className="flex flex-col justify-center items-center animate-pulse ">
                    <div className="h-24 w-24 rounded-lg border bg-gray-200"></div>
                    <p className="font-semibold text-lg mt-4 h-4 w-14 bg-gray-200"></p>
                  </div>
                </>
              ) : (
                <>
                  {clientsData?.map(client => (
                    <div
                      key={client.clientId}
                      className="flex flex-col justify-center items-center cursor-pointer"
                      onClick={async () => {
                        await selectProduct(client.clientId);
                        router.replace('/overview');
                      }}>
                      <div className="h-24 w-24 rounded-lg border">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ height: 'auto', width: '100%' }}
                        />
                      </div>
                      <p className="font-semibold md:text-lg text-sm mt-4">
                        {client.name}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProductPage;
