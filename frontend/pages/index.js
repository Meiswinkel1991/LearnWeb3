import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center text-white text-2xl h-full ">
      <div className=" flex space-x-4 items-center w-3/4">
        <div className="inline-block space-y-4">
          <h1 className="text-4xl font-bold">
            Welcome to my Web <span className="text-primary rotate-45">3</span>{" "}
            Learning project
          </h1>
          <p>
            There are several Dapps on this website that cover different
            concepts in the Web3 space. The ideas and partly the implementations
            have emerged from the courses of{" "}
            <a
              href="https://beta.learnweb3.io/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary"
            >
              learnweb3.io
            </a>
            .
          </p>
          <p>
            On this website I would like to present my acquired knowledge and
            results of the completed courses of LearnWeb3.
          </p>
        </div>

        <Image
          src="/crypto-images/11.svg"
          alt="graphic of crypto devs"
          width={1200}
          height={1200}
        />
      </div>
    </div>
  );
}
