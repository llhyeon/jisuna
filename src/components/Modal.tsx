import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import UserDropdown from "@/components/ui/UserDropdown";
import UserTextbox from "@/components/UserTextbox";
import { GROUP_OPTIONS, VISIT_DAY_OPTIONS } from "@/data/constants";
import type { AddressPoint } from "@/schemas/addressSchema";
import { useMapStore } from "@/store/useMapStore";
import { useFieldArray, useForm } from "react-hook-form";

interface FormValues {
  items: AddressPoint[];
}

interface Props {
  address: AddressPoint[];
}

function Modal({ address }: Props) {
  const closeModal = useMapStore((s) => s.closeModal);
  const updatedAddresses = useMapStore((s) => s.updateAddresses);

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: {
      items: address,
    },
  });

  const { fields } = useFieldArray({ name: "items", control });

  const onSubmit = async (data: FormValues) => {
    const updatedItems = data.items.filter((_, index) => {
      return Boolean(dirtyFields.items?.[index]);
    });

    if (updatedItems.length === 0) {
      closeModal();
      return;
    }

    try {
      await updatedAddresses(updatedItems);
      closeModal();
    } catch (error) {
      console.error("DB 업데이트 중 실패했습니다.", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}>
      <Card className="w-[90%] relative">
        <CardHeader>
          <CardTitle className="text-center font-bold text-lg">가구 상세 정보</CardTitle>
          <Button className="absolute top-1 right-1" variant={"ghost"} onClick={closeModal}>
            X
          </Button>
        </CardHeader>
        <CardContent className="max-h-100 overflow-y-scroll">
          <form
            id="detail-address-edit"
            className="divide-y-2 divide-black/20"
            onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex flex-col gap-4 py-4">
                  <div className="flex items-center">
                    <span className="min-w-15 font-bold">가구주</span>
                    <h2 className="text-gray-700">{field.householder}</h2>
                    <span className="py-2 px-2 rounded-full bg-primary text-surface text-xs ml-auto">
                      {field.neighborhood}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold min-w-15">주소</span>
                    <p className="text-gray-700">{field.address}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold min-w-15">연락처</span>
                    <p className="text-gray-700">{field.phoneNumber}</p>
                  </div>
                  <UserDropdown
                    label="그룹"
                    options={GROUP_OPTIONS}
                    {...register(`items.${index}.groupId`, { valueAsNumber: true })}
                  />
                  <UserDropdown
                    label="방문 날짜"
                    options={VISIT_DAY_OPTIONS}
                    {...register(`items.${index}.visitDay`, { valueAsNumber: true })}
                  />
                  <UserTextbox
                    label="특이사항"
                    {...register(`items.${index}.note`)}
                    placeholder="특이사항 없음"
                    rows={5}
                    disabled
                  />
                  <div className="flex items-center">
                    <span className="min-w-16 font-bold">선풍기</span>
                    <Checkbox
                      className="size-6 border border-gray-500"
                      checked={!!field.needFan}
                      disabled
                    />
                  </div>
                </div>
              );
            })}
          </form>
        </CardContent>
        <CardFooter className="flex">
          <Button
            className={`flex-1 ${!isDirty ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={!isDirty}
            type="submit"
            form="detail-address-edit">
            저장
          </Button>
          <Button className="flex-1" onClick={closeModal}>
            취소
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Modal;
