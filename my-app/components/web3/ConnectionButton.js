import { ArrowDownIcon } from "@heroicons/react/solid";
import { useConnect } from "wagmi";

const ConnectionButton = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <button className="rounded-xl my-1 bg-btngrey border-2 border-primary hover:bg-primary hover:border-white text-white px-4">
      <div className="flex items-center ">
        <span className="mx-2 my-2">Connect Wallet</span>
        <ArrowDownIcon className="w-5 h-5 my-2" />
      </div>
    </button>
  );
};

export default ConnectionButton;
