import { Footer } from "flowbite-react";

const FooterBar = () => {
  return (
    <>
      <Footer container>
        <div className="w-full text-center">
          <Footer.Copyright href="#" by="GECA" year={2025} />
        </div>
      </Footer>
    </>
  );
};

export default FooterBar;
