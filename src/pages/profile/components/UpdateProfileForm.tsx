import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/forms/FormInput";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { authClient } from "@/lib/auth";
import { uploadProfileImage } from "@/services/api";
import type { UpdateProfileFormValues } from "@/types/auth";

interface UpdateProfileFormProps {
  name: string;
  image: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateProfileForm({
  name,
  image,
  onSuccess,
  onCancel,
}: UpdateProfileFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormValues>({
    defaultValues: { name },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function onSubmit({ name: newName }: UpdateProfileFormValues) {
    // let imageUrl = image ?? undefined;

    if (imageFile) {
      try {
        await uploadProfileImage(imageFile);
      } catch {
        toast.error("Failed to upload image");
        return;
      }
    }

    const { error } = await authClient.updateUser({
      name: newName,
    });

    if (error) {
      toast.error(error.message ?? "Failed to update profile");
    } else {
      toast.success("Profile updated");
      reset({ name: newName });
      setImageFile(null);
      onSuccess?.();
    }
  }

  const isFormDirty = isDirty || imageFile !== null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormTextInput
        label="Name"
        inputId="profile-name-input"
        errors={errors.name}
      >
        <FormInput
          id="profile-name-input"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
      </FormTextInput>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Profile picture
        </p>
        <div className="flex items-center gap-4">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="h-16 w-16 rounded-full object-cover border"
            />
          )}
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? "Change image" : "Upload image"}
            </Button>
            {imageFile && (
              <p className="text-xs text-muted-foreground">{imageFile.name}</p>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isFormDirty}
          className="rounded-full"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          )}
          Save changes
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
