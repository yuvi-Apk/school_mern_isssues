const Card = ({ bg, header, number }) => {
  return (
    <div
      className={`
      ml-6 mt-7
      w-[20rem] h-[8rem]
      ${bg}
      rounded-lg
      shadow-lg
      flex flex-col justify-center items-center
      p-4
      text-white
      transform transition-transform duration-300 hover:scale-105
    `}
    >
      <h1
        className="
        text-center
        text-lg font-semibold
        mb-2
        truncate w-full
      "
      >
        {header}
      </h1>
      <h2
        className="
        text-3xl font-bold
      "
      >
        {number}
      </h2>
    </div>
  );
};

export default Card;
