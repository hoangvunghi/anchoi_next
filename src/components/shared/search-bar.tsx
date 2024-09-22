"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {searchApi} from "@/api/search-api";
import {District, Ward} from "@/types/main";
import {toast} from "sonner";
import {AppProvider, useAppContext} from "@/components/providers/app-context";
import {useParams, useRouter} from "next/navigation";

const FormSchema = z.object({
  entertainment_type: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  province_id: z.string().optional(),
  district_id: z.string().optional(),
});

export function SearchBarComp() {
  return (
    <AppProvider>
      <SearchBar/>
    </AppProvider>
  )
}

export function SearchBar() {
  const {
    entertainmentTypes,
    provinces,
    districts,
    wards,
    setDistricts,
    setWards,
  } = useAppContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [disableDistrict, setDisableDistrict] = useState(false);
  const [disableWard, setDisableWard] = useState(false);
  useEffect(() => {
    const provinceId = form.getValues("province_id");
    (async () => {
      if (provinceId) {
        form.setValue("district", "");
        const res = await searchApi.getDistrict(provinceId);
        setDistricts(res as unknown as District[]);
        setDisableDistrict(false);
      } else {
        setDisableDistrict(true);
        form.setValue("district", "");
      }
    })();
  }, [form.watch("province")]);

  useEffect(() => {
    const districtId = form.getValues("district_id");
    (async () => {
      if (districtId) {
        form.setValue("ward", "");
        const res = await searchApi.getWard(districtId);
        setWards(res as unknown as Ward[]);
        setDisableWard(false);
      } else {
        setDisableWard(true);
        form.setValue("ward", "");
      }
    })();
  }, [form.watch("district")]);
  const router = useRouter();
  const {slug} = useParams();
  const handleFindNearest = async () => {
    if (form.getValues('entertainment_type')) {
      router.push(`/nearest/${form.getValues('entertainment_type')}`)

    } else {

      router.push('/nearest/all')
    }
  }
  useEffect(() => {
    const isFormEmpty =
      !form.getValues("entertainment_type") &&
      !form.getValues("province") &&
      !form.getValues("district") &&
      !form.getValues("ward");
    if (slug && isFormEmpty) {
      const slugParts = slug;

      const typeValue = entertainmentTypes?.find((item) =>
        slugParts.includes(item.slug)
      );

      const provinceValue = provinces?.find((item) =>
        slugParts.includes(item.slug)
      );

      const districtValue = districts?.find((item) =>
        slugParts.includes(item.slug)
      );

      const wardValue = wards?.find((item) => slugParts.includes(item.slug));
      if (typeValue) {
        form.setValue("entertainment_type", typeValue.slug);
      }
      if (provinceValue) {
        form.setValue("province", provinceValue.slug);
        form.setValue("province_id", String(provinceValue.id));
      }
      if (districtValue) {
        form.setValue("district", districtValue.slug);
        form.setValue("district_id", String(districtValue?.id));
      }
      if (wardValue) {
        form.setValue("ward", wardValue.slug);
      }
    }
  }, [slug, entertainmentTypes, provinces, districts, wards]);

  form.getValues("district");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const slugParts = [
      data.entertainment_type,
      data.province,
      data.district,
      data.ward,
    ].filter((item) => Boolean(item));
    if (slugParts.length === 0) {
      toast.error("No value to search");
      return;
    }
    const newSlug = slugParts.length === 1 ? slugParts[0] : slugParts.join("-");

    router.push(`/search/${newSlug}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-row gap-4 flex-wrap">
          <FormField
            control={form.control}
            name="entertainment_type"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "md:w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? entertainmentTypes.find(
                            (type) => type.slug === field.value
                          )?.name
                          : "Chọn loại hình"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm loại hình..."
                        className="h-9"
                      />
                      <CommandList className="scroll-custom">
                        <CommandEmpty>Không tìm thấy loại hình</CommandEmpty>
                        <CommandGroup>
                          {entertainmentTypes.map((type) => (
                            <CommandItem
                              value={type.slug}
                              key={type.id}
                              onSelect={() => {
                                form.setValue("entertainment_type", type.slug);
                              }}
                            >
                              {type.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  type.slug === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "md:w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? provinces.find(
                            (province) => province.slug === field.value
                          )?.name
                          : "Chọn tỉnh/thành phố"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm tỉnh/thành phố..."
                        className="h-9"
                      />
                      <CommandList className="scroll-custom">
                        <CommandEmpty>
                          Không tìm thấy tỉnh/thành phố
                        </CommandEmpty>
                        <CommandGroup>
                          {provinces.map((province) => (
                            <CommandItem
                              value={province.slug}
                              key={province.id}
                              onSelect={() => {
                                form.setValue("province", province.slug);
                                form.setValue(
                                  "province_id",
                                  String(province.id)
                                );
                              }}
                            >
                              {province.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  province.slug === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={disableDistrict}
                        role="combobox"
                        className={cn(
                          "md:w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? districts.find(
                            (district) => district?.slug === field.value
                          )?.name
                          : "Chọn quận/huyện"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm quận/huyện..."
                        className="h-9"
                      />
                      <CommandList className="scroll-custom">
                        <CommandEmpty>Không tìm thấy quận/huyện</CommandEmpty>
                        <CommandGroup>
                          {districts.map((district) => (
                            <CommandItem
                              value={district?.slug}
                              key={district?.name}
                              onSelect={() => {
                                form.setValue("district", district?.slug);
                                form.setValue(
                                  "district_id",
                                  String(district?.id)
                                );
                              }}
                            >
                              {district?.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  district?.slug === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ward"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "md:w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={disableWard}
                      >
                        {field.value
                          ? wards.find((ward) => ward?.slug === field.value)
                            ?.name
                          : "Chọn xã/phường"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm xã/phường..."
                        className="h-9"
                      />
                      <CommandList className="scroll-custom">
                        <CommandEmpty>Không tìm thấy xã/phường</CommandEmpty>
                        <CommandGroup>
                          {wards.map((ward) => (
                            <CommandItem
                              value={ward?.slug}
                              key={ward?.id}
                              onSelect={() => {
                                form.setValue("ward", ward?.slug);
                              }}
                            >
                              {ward?.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  ward?.slug === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit">Tìm kiếm</Button>
          <Button type="button" variant='outline' onClick={() => handleFindNearest()}>Tìm kiếm gần đây</Button>
        </div>
      </form>
    </Form>
  );
}
