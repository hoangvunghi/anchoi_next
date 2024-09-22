"use client";

import {z} from "zod";
import {Button} from "../ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import {Input} from "../ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "../ui/textarea";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {mainApi} from "@/api/main-api";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {LoaderCircle, Star} from "lucide-react";
import {CommentData} from "@/types/main";
import {shortenName} from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.string().email({message: "Invalid email address"}),
  body: z.string().optional(),
  number_of_star: z.string(),
});

const formReplySchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.string().email({message: "Invalid email address"}),
  body: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type FormReplyValues = z.infer<typeof formReplySchema>;

export default function CommentBox({idSpot}: { idSpot: number }) {
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [openReply, setOpenReply] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number_of_star: "5",
      body: "",
      email: "",
      name: "",
    },
  });

  const formReply = useForm<FormReplyValues>({
    resolver: zodResolver(formReplySchema),
    defaultValues: {
      body: "",
      email: "",
      name: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await mainApi.getMessages(idSpot);
      setComments(res as unknown as CommentData[]);
    } catch {
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idSpot]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoadingBtn(true);
    try {
      await mainApi.createMessage({
        ...data,
        entertainment_spot_id: idSpot,
      });
      await fetchData();
      form.reset();
      toast.success("Comment submitted successfully");
    } catch {
      toast.error("Failed to submit comment");
    } finally {
      setLoadingBtn(false);
    }
  };

  const onReplySubmit: SubmitHandler<FormReplyValues> = async (data) => {
    if (openReply === null) return;
    setLoadingBtn(true);
    try {
      await mainApi.createMessage({
        ...data,
        entertainment_spot_id: idSpot,
        parent_id: openReply,
      });
      await fetchData();
      formReply.reset();
      toast.success("Reply submitted successfully");
    } catch {
      toast.error("Failed to submit reply");
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div>
      <div className="max-h-[500px] overflow-y-auto relative divide-y scroll-custom">
        {!loading ? (
          comments.length > 0 ? (
            comments.map((cmt) => (
              <div key={cmt.id} className="flex py-3 gap-2">
                <Avatar className="w-[50px] h-[50px]">
                  <AvatarFallback>{shortenName(cmt.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{cmt.name}</p>-
                    <div className="flex items-center">
                      {cmt.number_of_star}
                      <Star className="w-4 h-4 ml-2 stroke-yellow-400 fill-yellow-400"/>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{cmt.email}</p>
                  <p className="mt-2">{cmt.body}</p>
                  <span
                    onClick={() => setOpenReply(cmt.id)}
                    className="block mt-2 text-sm text-blue-500 cursor-pointer hover:underline"
                  >
                    Trả lời
                  </span>
                  {cmt.replies?.length > 0 &&
                    cmt.replies.map((item) => (
                      <div className="pl-5 py-2 mt-2 border-t flex gap-2" key={item.id}>
                        <Avatar className="w-[50px] h-[50px]">
                          <AvatarFallback>
                            {shortenName(item.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{item.name}</p>-
                            <div className="flex items-center">
                              {item.number_of_star}
                              <Star className="w-4 h-4 ml-2 stroke-yellow-400 fill-yellow-400"/>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.email}
                          </p>
                          <p className="mt-2">{item.body}</p>
                        </div>
                      </div>
                    ))}
                  {openReply === cmt.id && (
                    <div className="bg-muted p-4 rounded-lg mt-2">
                      <Form {...formReply}>
                        <form
                          onSubmit={formReply.handleSubmit(onReplySubmit)}
                          className="space-y-2"
                        >
                          <FormField
                            control={formReply.control}
                            name="name"
                            render={({field}) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name/Unit" {...field} />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formReply.control}
                            name="email"
                            render={({field}) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Email..." {...field} />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formReply.control}
                            name="body"
                            render={({field}) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Message..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <Button disabled={loadingBtn} type="submit">
                            {loadingBtn && (
                              <LoaderCircle className="w-4 h-4 mr-2 animate-spin"/>
                            )}
                            Submit
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/40">
            <LoaderCircle className="w-5 h-5 animate-spin"/>
          </div>
        )}
      </div>

      <div className="border mt-2 rounded-md p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name/Unit" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({field}) => (
                <FormItem className="space-y-1">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Message..." {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number_of_star"
              render={({field}) => (
                <FormItem className="space-y-2">
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RadioGroup className='flex flex-row gap-8 flex-wrap' {...field}>
                      <FormItem className='flex flex-row items-center gap-2  space-y-0'>
                        <FormLabel>1 Star</FormLabel>
                        <FormControl>
                          <RadioGroupItem value="1"/>
                        </FormControl>
                      </FormItem>
                      <FormItem className='flex flex-row items-center gap-2  space-y-0'>
                        <FormLabel>2 Stars</FormLabel>
                        <FormControl>
                          <RadioGroupItem value="2"/>
                        </FormControl>
                      </FormItem>
                      <FormItem className='flex flex-row items-center gap-2  space-y-0'>
                        <FormLabel>3 Stars</FormLabel>
                        <FormControl>
                          <RadioGroupItem value="3"/>
                        </FormControl>
                      </FormItem>
                      <FormItem className='flex flex-row items-center gap-2  space-y-0'>
                        <FormLabel>4 Stars</FormLabel>
                        <FormControl>
                          <RadioGroupItem value="4"/>
                        </FormControl>
                      </FormItem>
                      <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                        <FormLabel>5 Stars</FormLabel>
                        <FormControl>
                          <RadioGroupItem value="5"/>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={loadingBtn} type="submit">
              {loadingBtn && (
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin"/>
              )}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
