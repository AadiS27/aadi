'use client'

import { useProModal } from '@/hooks/use-pro-modal';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Heading from "@/components/heading";
import { Download, ImageIcon, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolution } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';


const ImagePage = () => {
    const ProModal=useProModal();
    const[images,setImages]=useState<string[]>([]);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount:'1',
            resolution:'512x512',
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
       
            setImages([]);
            const response = await axios.post('/api/image',values);
            const urls=[response.data]
            setImages(urls);
            form.reset();
        } catch (error: any) {
            if(error?.response?.status==403){
                ProModal.onOpen();
           }
        } finally {
            router.refresh();
        }
    }

    const renderMessageContent = (content: any) => {
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content.map((part, index) => (
                <span key={index}>{JSON.stringify(part)}</span>
            ));
        }
        return JSON.stringify(content);
    };

    return (
        <div>
            <Heading
                title='Image'
                description="Our most advanced Image Generation Model."
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='
                                rounded-lg
                                border 
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-sm
                                grid
                                grid-cols-12
                                gap-2'>
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-6'>
                                        <FormControl className='m-0 p-0'>
                                            <Input
                                                className='border-0 outline-none 
                                                focus-visible:ring-0 focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='Generate a picture'
                                                {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />

                                    <FormField
                                control={form.control}
                                name='resolution'
                                render={({field})=>(
                                    <FormItem className='col-span-12 lg:col-span-4'>
                                        <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolution().map((option)=>(
                                                    <SelectItem
                                                    key={option.value}
                                                    value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/ >
                            <Button
                                className='col-span-12 lg:col-span-2 w-full'
                                disabled={isLoading}>
                                Generate
                                </Button>
                        </form>
                    </Form>
                </div>
                <div className='space-y-4 mt-4'>
                    {isLoading &&(
                        <div className='p-20'>
                            <Loader />
                        </div>
                   )}
                   {images.length == 0 && !isLoading && (
                       <Empty label='No Images Generated' />
                   )}
                   <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
                       {images.map((src, index) => (
                           <Card
                               key={index}
                               className='rounded-lg overflow-hidden'>
                               <div className='relative aspect-square'>
                                   <Image 
                                       alt='Image'
                                       fill
                                       src={src}/>
                               </div>
                               <CardFooter className='p-2'>
                                   <Button onClick={() => window.open(src)} variant='secondary' className='w-full'>
                                       <Download className='h-4 w-4 mr-2'/>
                                       Download
                                   </Button>
                               </CardFooter>
                           </Card>
                       ))}
                   </div>
               </div>
           </div>
       </div>
    )
}

export default ImagePage;
