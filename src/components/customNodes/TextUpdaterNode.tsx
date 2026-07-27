import { Plus } from "lucide-react";
import { useCallback } from "react";

export function TextUpdaterNode(props:any) {
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="flex justify-center items-center border-dotted border-2 border-white ">
      <div>
        <Plus className="size-4"/>        
      </div>
    </div>
  );
}