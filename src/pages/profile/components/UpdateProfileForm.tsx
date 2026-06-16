import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { authClient } from "@/lib/auth";
import type { UpdateProfileFormValues } from "@/types/auth";

interface UpdateProfileFormProps {
  name: string;
  image: string | null;
}

export function UpdateProfileForm({ name, image }: UpdateProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormValues>({
    defaultValues: { name, image: image ?? "" },
  });

  useEffect(() => {
    reset({ name, image: image ?? "" });
  }, [name, image, reset]);

  async function onSubmit({ name: newName, image: newImage }: UpdateProfileFormValues) {
    const { error } = await authClient.updateUser({
      name: newName,
      image: newImage || undefined,
    });

    if (error) {
      toast.error(error.message ?? "Failed to update profile");
    } else {
      toast.success("Profile updated");
      reset({ name: newName, image: newImage });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormTextInput label="Name" inputId="profile-name-input" errors={errors.name}>
        <FormInput
          id="profile-name-input"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
      </FormTextInput>

      <FormTextInput label="Profile picture URL" inputId="profile-image-input" errors={errors.image}>
        <FormInput
          id="profile-image-input"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          {...register("image", {
            pattern: {
              value: /^(https?:\/\/.+)?$/,
              message: "Enter a valid URL",
            },
          })}
        />
      </FormTextInput>

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="rounded-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
