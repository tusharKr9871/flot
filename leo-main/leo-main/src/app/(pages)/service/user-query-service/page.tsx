'use client';

import { useFetchCustomerQueryServices } from "@/hooks/user-query-service-api";
import { useFetchCustomerRepliedServices } from '@/hooks/user-query-reply-display-api';
import { axiosInstance } from "@/network/axiosInstance";
import { Card, Flex, Grid, Metric, Text, Button, Textarea } from '@tremor/react';
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from '@/context/AuthContextProvider';

const UserQueryService = () => {
    const { customerQueryData, isFetchingCustomerQueryServiceData } = useFetchCustomerQueryServices();
    const { repliedData, isFetchingRepliedData} = useFetchCustomerRepliedServices();

    if (isFetchingCustomerQueryServiceData && isFetchingRepliedData) {
        <div className="md:px-14 mx-2 md:pt-20 pt-10 h-auto pb-10">
            <Metric>All Customer Query</Metric>
            <Card className="animate-pulse">
                <Flex alignItems="start">
                    <div className="truncate">
                        <div className="h-2.5 w-1/3 bg-gray-200"></div>
                        <div className="h-4 w-2/3 bg-gray-200"></div>
                    </div>
                </Flex>
                <Flex className="mt-4 space-x-2">
                    <div className="h-2.5 w-1/3 bg-gray-200"></div>
                    <div className="h-2.5 w-1/3 bg-gray-200"></div>
                </Flex>
            </Card>
        </div>;
    }

    const [replyBoxVisible, setReplyBoxVisible] = useState<Record<number, boolean>>({});
    const [replyBoxValue, setReplyBoxValue] = useState<string>("");
    const [customer_query_id, set_customer_query_id] = useState<string>("");
    const [customer_query_email, set_customer_query_email] = useState<string>("");

    const handleReplyClick = async(index: number, customer_query_id:string, customer_query_email: string) => {
        setReplyBoxVisible(prev => ({ ...prev, [index]: !prev[index] }));
        set_customer_query_email(customer_query_email);
        set_customer_query_id(customer_query_id);
    }

    const {user} = useAuth();

    const handleSend = async()=>{
        try{
            await axiosInstance.post('/services/user-query-service-reply',{
                replyBoxValue,
                customer_query_id,
                customer_query_email,
            });
            toast.success("Reply sent");
            setReplyBoxValue("");
        }
        catch(error){
            console.log("error:::", error);
            toast.error("getting error while posting")
        }
    }

    return (
        <div className="mx-2 pt-10 h-auto pb-10">
            <Metric>All Customer Query</Metric>
            <Grid className="gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {customerQueryData?.map((query: any, index: number) => (
                    <Card key={index} className="mt-4 w-full">
                        <Flex alignItems="start" className="mb-2">
                            <div className="truncate">
                                <Text className="text-lg">Customer Name: {query.customer_query_name}</Text>
                                <Text className="text-sm text-gray-500">Customer Email: {query.customer_query_email}</Text>
                            </div>
                        </Flex>
                        <Text className="text-gray-600"><span className="font-semibold">Customer Query: </span>{query.customer_query_description}</Text>
                        <Flex className="mt-4 space-x-2">
                            <Text className="text-xs text-gray-400">Request Type:</Text>
                            <Text className="text-xs text-gray-600">{query.customer_query_type_of_request}</Text>
                        </Flex>
                        <Flex className="mt-2 space-x-2">
                            <Text className="text-xs text-gray-400">Request Number:</Text>
                            <Text className="text-xs text-gray-600">{query.customer_query_service_req_number}</Text>
                        </Flex>
                        <Flex className="mt-2 space-x-2">
                            <Text className="text-xs text-gray-400">Created At:</Text>
                            <Text className="text-xs text-gray-600">{new Date(query.created_at).toLocaleString()}</Text>
                        </Flex>
                        {replyBoxVisible[index] && (
                            <Textarea placeholder="Type here..." className="mx-auto max-w-xs mt-2" onChange={(e) => setReplyBoxValue(e.target.value)} required/>
                        )}
                       {
                        repliedData?.filter((data: any)=> data?.customer_query_id === query.customer_query_id)
                        .map((filteredItem: any, filteredItemIndex: number)=> <div key={filteredItemIndex} className="text-gray-600 mt-2 bg-orange-300 p-2 rounded-md space-y-2">
                            <Flex><Text>Reply:{' '}</Text>
                            <Text>{filteredItem?.customer_query_reply_des}</Text>
                            </Flex>
                            <Flex><Text>Replied By:{' '}</Text>
                            <Text>{filteredItem?.customer_query_reply_by === user?.id ? user?.name: filteredItem?.customer_query_reply_by}</Text>
                            </Flex>
                            <Flex>
                            <Text>Replied at:{' '}</Text>
                            <Text>{new Date(filteredItem?.updated_at).toLocaleString()}</Text>
                            </Flex>
                        </div>)
                       }
                        <Button
                            className="text-white font-semibold bg-orange-400 border-none mt-2 hover:bg-orange-500"
                            onClick={() => handleReplyClick(index, query?.customer_query_id, query?.customer_query_email)}
                        >
                            {!replyBoxVisible[index] ? 'Reply' : 'Close View'}
                        </Button>
                        {replyBoxVisible[index] && (
                            <Button onClick={handleSend} className="text-white font-semibold float-right bg-orange-400 border-none mt-2 hover:bg-orange-500">
                                Send
                            </Button>
                        )}
                    </Card>
                ))}
            </Grid>
        </div>
    )
}

export default UserQueryService;