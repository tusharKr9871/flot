'use client';

import { useCallback, ReactNode, useContext, useState } from 'react';
import {
  TbHome,
  TbUserPlus,
  TbAddressBook,
  TbTargetArrow,
  TbId,
  TbCreditCard,
  TbBuildingBank,
  TbBusinessplan,
  TbReportAnalytics,
  TbChevronLeft,
  TbUser,
  TbZoomMoney,
  TbUserDollar,
  TbPhoneCall,
  TbCircleCheck,
  TbCircleX,
  TbFileX,
  TbFileLike,
  TbCash,
  TbReceipt2,
  TbCoins,
  TbReceiptRefund,
  TbLogout,
  TbPhoneOff,
  TbReportMoney,
  TbCashBanknote,
  TbCircleRectangle,
  TbPlus,
  TbSignature,
  TbCloudLock,
  TbBrandHipchat,
  TbReport,
  TbSettings,
  TbTicket,
  TbAccessPoint,
} from 'react-icons/tb';
import classNames from 'classnames';
import styles from './Sidebar.module.css';
import { SideBarContextType, SidebarContext } from '@/context/SidebarProvider';
import { Subtitle, Text, Title } from '@tremor/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContextProvider';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContextProvider';
import ModalContainer from '../modal';
import { useClients } from '@/hooks/clients-api';
import { enumCleaner } from '@/utils/utils';

const Sidebar = ({ children }: { children: ReactNode }) => {
  const {
    expanded,
    setExpanded,
    subMenuExpanded,
    setSubMenuExpanded,
    selectedMenu,
    setSelectedMenu,
  } = useContext<SideBarContextType>(SidebarContext);

  const { user, logout } = useAuth();
  const router = useRouter();
  const { logoUrl } = useTheme();
  const [openBrandSwitcher, setOpenBrandSwitcher] = useState(false);
  const { clientsData, isFetchingClientsData } = useClients();
  const { selectProduct } = useAuth();

  const renderIcon = useCallback((element: string) => {
    switch (element) {
      case 'Overview-12':
        return <TbHome />;
      case 'Management':
        return <TbUserPlus />;
      case 'Service':
        return <TbSettings />;
      case 'Contacts':
        return <TbAddressBook />;
      case 'Leads':
        return <TbTargetArrow />;
      case 'KYC':
        return <TbId />;
      case 'Credit':
        return <TbCreditCard />;
      case 'Disbursal':
        return <TbBuildingBank />;
      case 'Collection':
        return <TbBusinessplan />;
      case 'Reports':
        return <TbReportAnalytics />;
    }
  }, []);

  // TODO : move this out of this file
  const renderSubMenuIcons = useCallback((element: string) => {
    switch (element) {
      case 'User Management':
        return <TbUser />;
      case 'Audit Logs':
        return <TbReport />;
      case 'Employee Management':
        return <TbUser />;
      case 'Sanctionwise Targets':
        return <TbTargetArrow />;
      case 'Branchwise Targets':
        return <TbTargetArrow />;
      case 'Create Lead':
        return <TbPlus />;
      case 'All Leads':
        return <TbUserDollar />;
      case 'Fresh Leads':
        return <TbZoomMoney />;
      case 'Callback Leads':
        return <TbPhoneCall />;
      case 'Interested':
        return <TbCircleCheck />;
      case 'No Answer':
        return <TbPhoneOff />;
      case 'Not Interested':
        return <TbCircleX />;
      case 'Not Eligible':
        return <TbCircleX />;
      case 'Incomplete Docs':
        return <TbFileX />;
      case 'Docs Recieved':
        return <TbFileLike />;
      case 'KYC Requests':
        return <TbCloudLock />;
      case 'E-Sign Docs':
        return <TbSignature />;
      case 'User Query Service':
        return <TbBrandHipchat />;
      case 'Active Services':
        return <TbAccessPoint />;
      case 'Tickets':
        return <TbTicket />;
      case 'Approved':
        return <TbCircleCheck />;
      case 'Rejected':
        return <TbCircleX />;
      case 'Disbursed':
        return <TbCash />;
      case 'Bank Update':
        return <TbBuildingBank />;
      case 'Payday Pending':
        return <TbReceipt2 />;
      case 'All Collections':
        return <TbBusinessplan />;
      case 'Part Payment':
        return <TbCoins />;
      case 'Closed':
        return <TbCircleCheck />;
      case 'Settlement':
        return <TbReceiptRefund />;
      case 'Waiver Requests':
        return <TbReceiptRefund />;
      case 'Disbursed Data':
        return <TbReportMoney />;
      case 'Collection Data':
        return <TbCashBanknote />;
      case 'CIBIL Data':
        return <TbCircleRectangle />;
    }
  }, []);

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <nav
        className={classNames([
          'fixed left-0 top-0 bottom-0 items-center z-50 bg-primaryColor flex flex-col h-screen justify-between py-6 shadow-md transition-all duration-500 select-none',
          expanded ? 'w-56' : 'w-14',
          styles.sideBar,
        ])}
        onClick={() => setExpanded(prev => !prev)}>
        {/* organization logo */}
        <div className="w-[90%]">
          <div
            className={classNames(
              'w-full flex flex-row items-center justify-center pb-2',
            )}>
            <span
              className="flex items-center justify-center h-12 w-12 rounded-lg bg-white"
              onClick={() => setOpenBrandSwitcher(true)}>
              <Image
                alt="Logo"
                src={logoUrl || ''}
                height={0}
                width={0}
                sizes="100vw"
                style={{ height: '100%', width: '100%', borderRadius: 24 }}
              />
            </span>
            {expanded && (
              <div className="pl-2 w-full flex flex-row justify-between items-center">
                <div>
                  <Text className="text-white text-xs">Hi, {user.name}</Text>
                  <Text className="text-white font-medium">
                    {enumCleaner(user.role)}
                  </Text>
                </div>
                {/* <div>
                  <div className="h-10 w-10 bg-gray-50 hover:bg-gray-400 cursor-pointer rounded-xl flex items-center justify-center text-secondaryColor text-lg relative">
                    <span className="h-5 w-5 flex justify-center items-center text-white absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full">
                      24
                    </span>
                    <span className="text-xl">
                      <TbBell />
                    </span>
                  </div>
                </div> */}
              </div>
            )}
          </div>
          <div
            className={classNames([
              'w-full pt-6 border-t-[1px] border-t-white',
            ])}>
            <ul
              className={classNames([
                'flex flex-col flex-1 w-full',
                expanded ? 'items-start' : 'items-center',
              ])}>
              {/* mapping all the side bar menu items */}
              {user.tabsToRender.map((element, index) => (
                <li key={index} className="w-full">
                  <div className="flex flex-row text-white text-xl cursor-pointer">
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        if (element.menu === 'Overview') {
                          setSelectedMenu(element.menu);
                          router.push(`/${element.menu.toLowerCase()}`);
                        } else {
                          setSubMenuExpanded(prev =>
                            prev === element.id ? -1 : element.id,
                          );
                          setExpanded(() => true);
                        }
                      }}
                      className="items-center justify-center flex flex-col flex-1 hover:text-white/[0.5]">
                      {!expanded && (
                        <div className="py-4">{renderIcon(element.menu)}</div>
                      )}
                    </div>
                    {/* sidebar menu items when expanded */}
                    {expanded && (
                      <div className="w-full">
                        <div
                          className={classNames(
                            'flex flex-row flex-1 my-1 justify-between items-center py-2 cursor-pointer text-white hover:bg-white/[0.2] px-2 rounded-tremor-small',
                            subMenuExpanded === element.id
                              ? 'bg-white/[0.2]'
                              : '',
                          )}
                          onClick={e => {
                            e.stopPropagation();
                            if (element.menu === 'Overview') {
                              setSelectedMenu(element.menu);
                              router.push(`/${element.menu.toLowerCase()}`);
                            } else {
                              setSubMenuExpanded(prev =>
                                prev === element.id ? -1 : element.id,
                              );
                              setExpanded(() => true);
                            }
                          }}>
                          <div className="flex flex-row items-center">
                            <div className="mr-2">
                              {renderIcon(element.menu)}
                            </div>
                            <p className="font-medium text-sm">
                              {element.menu}
                            </p>
                          </div>
                          {element.menu !== 'Overview' && (
                            <span
                              className={classNames(
                                'text-xl',
                                subMenuExpanded === element.id &&
                                'transition-transform duration-500 transform -rotate-90',
                              )}>
                              <TbChevronLeft />
                            </span>
                          )}
                        </div>
                        {/* mapping all the menu sub menu items in sidebar */}
                        {/* dropdown animation using framer motion */}
                        <AnimatePresence initial={false}>
                          {subMenuExpanded === element.id && (
                            <motion.div
                              className="flex-col flex"
                              key="content"
                              initial="collapsed"
                              animate="open"
                              exit="collapsed"
                              variants={{
                                open: {
                                  opacity: 1,
                                  height: 'auto',
                                  type: 'tween',
                                  transition: {
                                    height: {
                                      duration: 0.4,
                                    },
                                    opacity: {
                                      duration: 0.25,
                                      delay: 0.3,
                                    },
                                  },
                                },
                                collapsed: {
                                  opacity: 0,
                                  height: 0,
                                  transition: {
                                    height: {
                                      duration: 0.4,
                                      delay: 0.25,
                                    },
                                    opacity: {
                                      duration: 0.25,
                                    },
                                  },
                                },
                              }}>
                              {element.subMenu?.map((subItem, index) => (
                                <div
                                  key={index}
                                  className={classNames(
                                    ' rounded-tremor-small px-2 py-2 my-1',
                                    selectedMenu === subItem.path
                                      ? 'bg-white/[0.8] hover:text-white/[0.8] text-secondaryColor'
                                      : 'text-white hover:bg-white/[0.2]',
                                  )}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedMenu(subItem.path);
                                    router.push(
                                      `/${element.menu.toLowerCase()}/${subItem.path
                                      }`,
                                    );
                                  }}>
                                  <div className="flex flex-row w-full items-center ml-2">
                                    <span className="mr-2 text-lg">
                                      {renderSubMenuIcons(subItem.label)}
                                    </span>
                                    <p className="font-medium text-xs">
                                      {subItem.label}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ModalContainer
            isOpen={openBrandSwitcher}
            onClose={() => setOpenBrandSwitcher(false)}
            styles="bg-white w-auto">
            <div className="w-full flex items-center justify-center">
              <div className="py-6">
                <div>
                  <Title className="pt-4">Select your product</Title>
                  <Subtitle className="pt-4">
                    You will be logged into the product you select
                  </Subtitle>
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
                          onClick={() => {
                            selectProduct(client.clientId);
                            setOpenBrandSwitcher(false);
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
                          <p className="font-semibold text-lg mt-4">
                            {client.name}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </ModalContainer>
        </div>

        <div
          className={classNames(
            'flex justify-between items-center',
            expanded ? 'w-full px-4 flex-row justify-center' : 'flex-col',
          )}>
          <span
            className={classNames(
              'text-3xl text-white hover:text-white/[0.2] cursor-pointer',
              expanded && 'mt-4',
            )}
            onClick={logout}>
            <TbLogout />
          </span>
        </div>
      </nav>
      <div
        className={classNames(
          'bg-backgroundColor',
          !expanded ? 'ml-14' : 'md:ml-56 ml-14 w-screen',
        )}>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
