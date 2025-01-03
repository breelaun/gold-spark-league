import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./components/ImageUpload";
import ProductDetails from "./components/ProductDetails";
import PricingInventory from "./components/PricingInventory";
import CategoryInput from "./components/CategoryInput";
import type { ProductFormData } from "./types";

interface ProductUploadFormProps {
  onSuccess?: () => void;
}

const ProductUploadForm = ({ onSuccess }: ProductUploadFormProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add products",
      });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          vendor_id: session.user.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          inventory_count: data.inventory_count,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      reset();
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      onSuccess?.();

    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add product",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ProductDetails register={register} errors={errors} />
          <PricingInventory register={register} errors={errors} />
          <CategoryInput register={register} />
          <ImageUpload onImageChange={setImageFile} imageFile={imageFile} />
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductUploadForm;