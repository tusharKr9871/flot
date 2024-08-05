import Loader from '@/components/loader';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 z-50">
      <Loader />
    </div>
  );
};

export default Loading;
