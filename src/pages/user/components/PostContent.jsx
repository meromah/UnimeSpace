import PostImages from "./PostImages";
import PostFiles from "./PostFiles";
import { useNavigate } from "react-router-dom";

const PostContent = ({ item, itemType, images, files }) => {
  const navigate = useNavigate();
  const onStartTest = (e)=>{
    e.stopPropagation()
    navigate(
      `/d/${item.data.desc.name}/tests/${item.data.id}/start`
    )
  }
  return (
    <div>
      {itemType === "test" ? (
        <div className="group flex justify-between items-center border-l-4 border-blue-500 bg-blue-50 dark:bg-neutral-800 p-4 rounded hover:bg-blue-100 dark:hover:bg-neutral-700 transition-colors duration-200">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.data.title}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-200">{item.data.body}</p>
          </div>
          <button
            className="ml-auto px-4 py-2 rounded bg-primary-blue text-white text-sm hover:bg-primary-blue/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
            onClick={onStartTest}
          >
            Start
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl text-neutral-900 dark:text-neutral-100">{item.data.title}</h1>
          <p className="text-neutral-700 dark:text-neutral-300">{item.data.body}</p>
          {/* Display images if available */}
          {images.length > 0 && <PostImages images={images} />}
          {/* Display files if available */}
          {files.length > 0 && <PostFiles files={files} />}
        </div>
      )}
    </div>
  );
};

export default PostContent;





