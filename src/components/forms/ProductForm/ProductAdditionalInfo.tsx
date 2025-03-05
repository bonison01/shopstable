
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductAdditionalInfoProps {
  imageUrl: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProductAdditionalInfo = ({
  imageUrl,
  description,
  handleChange,
}: ProductAdditionalInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          value={imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Product description..."
          rows={4}
        />
      </div>
    </>
  );
};

export default ProductAdditionalInfo;
