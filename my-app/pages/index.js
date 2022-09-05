import { useConnect } from "wagmi";

export default function Home() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div className="container flex justify-center items-center justify-items-center">
      <div className="flex flex-col justify-between justify-items-center items-center bg-secondary rounded-xl mt-8 p-4 box-shadow">
        {connectors.map((connector) => (
          <button
            className="bg-jellypink rounded-xl text-white my-4 mx-4 px-2 py-2"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        {error && <div className="text-red-500">{error.message}</div>}
      </div>
    </div>
  );
}
