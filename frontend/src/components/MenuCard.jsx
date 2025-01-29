const MenuCard = () => {
  return (
    <div className="flex flex-row w-full h-full gap-2 bg-white cursor-pointer p-3 rounded-xl items-center">
      <img
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
        alt="Placeholder"
        className="w-40 h-40 rounded-lg"
      />
      <div className="flex flex-col justify-between h-40 w-full">
        {/* Upper section */}
        <div>
          <div className="flex w-full gap-2 items-center justify-between">
            <h2 className="whitespace-nowrap text-dark font-bold text-lg">
              Menu Name
            </h2>
            <h3 className="whitespace-nowrap text-accent font-bold text-2xl">
              $ 123
            </h3>
          </div>
          <p className="text-gray-500">Descriptions</p>
        </div>

        <button className="w-full h-fit py-2 text-accent border border-accent rounded-full bg-white font-bold hover:bg-gray-100 hover:border-accent-hover hover:text-accent-hover">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
