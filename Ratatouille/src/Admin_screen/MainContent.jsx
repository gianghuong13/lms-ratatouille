import PropTypes from "prop-types";

const MainContent = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch flex-1 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-xl bg-white overflow-hidden flex flex-row items-start justify-start pt-[1.937rem] px-[2.812rem] pb-[15.5rem] box-border gap-[3.562rem] max-w-full text-left text-[1rem] text-black font-inter mq800:flex-wrap mq800:pt-[1.25rem] mq800:pb-[10.063rem] mq800:box-border mq450:gap-[1.75rem] mq1125:pl-[1.375rem] mq1125:pr-[1.375rem] mq1125:box-border ${className}`}
    >
      <div className="flex flex-row items-end justify-start gap-[0.812rem]">
        <div className="flex flex-col items-start justify-start gap-[0.812rem]">
          <img
            className="w-[1.875rem] h-[1.875rem] relative overflow-hidden shrink-0"
            loading="lazy"
            alt=""
            src="/boxarrowright.svg"
          />
          <img
            className="w-[1.875rem] h-[1.875rem] relative overflow-hidden shrink-0 z-[1]"
            loading="lazy"
            alt=""
            src="/key.svg"
          />
        </div>
        <div className="flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.312rem]">
          <div className="flex flex-col items-start justify-start gap-[1.312rem]">
            <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[3.688rem]">
              Log out
            </a>
            <i className="relative font-bold z-[1]">Change password</i>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start relative max-w-full text-[1.25rem] mq800:flex-1 mq800:min-w-full">
        <img
          className="h-[0.375rem] w-[67.938rem] absolute !m-[0] top-[3.438rem] right-[-21.125rem] object-contain"
          alt=""
          src="/line-2.svg"
        />
        <div className="self-stretch flex-1 flex flex-col items-start justify-start pt-[5.75rem] px-[0rem] pb-[0rem] box-border max-w-full mq450:pt-[3.75rem] mq450:box-border">
          <div className="self-stretch flex-1 shadow-[0px_4px_10px_rgba(0,_0,_0,_0.25)] rounded-3xs bg-white border-whitesmoke-200 border-[1px] border-solid box-border overflow-hidden flex flex-row items-start justify-start pt-[0.812rem] pb-[2.375rem] pl-[4.5rem] pr-[0.75rem] gap-[2.187rem] max-w-full mq800:gap-[1.063rem] mq800:pl-[2.25rem] mq800:box-border mq450:flex-wrap mq450:pt-[1.25rem] mq450:pb-[1.563rem] mq450:box-border">
            <div className="self-stretch flex-1 flex flex-col items-start justify-start pt-[0.812rem] px-[0rem] pb-[0rem] box-border max-w-full">
              <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[2.375rem] max-w-full mq450:gap-[1.188rem]">
                <div className="flex flex-row items-start justify-start py-[0rem] pl-[4.625rem] pr-[4.562rem] box-border max-w-full mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border">
                  <i className="relative font-bold mq450:text-[1rem]">
                    Change password
                  </i>
                </div>
                <form className="m-0 self-stretch flex-1 flex flex-col items-end justify-start gap-[1.625rem]">
                  <div className="self-stretch flex-1 rounded-10xs bg-lavender-200 border-darkgray-500 border-[1px] border-solid overflow-hidden flex flex-row items-start justify-start py-[0.562rem] px-[1rem]">
                    <input
                      className="w-[6.188rem] [border:none] [outline:none] font-inter text-[0.938rem] bg-[transparent] relative text-darkgray-100 text-left inline-block p-0"
                      placeholder="Old password"
                      type="text"
                    />
                  </div>
                  <div className="self-stretch flex-1 rounded-10xs bg-lavender-200 border-darkgray-500 border-[1px] border-solid overflow-hidden flex flex-row items-start justify-start py-[0.562rem] px-[1rem]">
                    <input
                      className="w-[9.125rem] [border:none] [outline:none] font-inter text-[0.938rem] bg-[transparent] relative text-darkgray-100 text-left inline-block p-0"
                      placeholder="Enter new password"
                      type="text"
                    />
                  </div>
                  <div className="self-stretch flex-1 rounded-10xs bg-lavender-200 border-darkgray-500 border-[1px] border-solid overflow-hidden flex flex-row items-start justify-start py-[0.562rem] px-[1rem]">
                    <input
                      className="w-[10.25rem] [border:none] [outline:none] font-inter text-[0.938rem] bg-[transparent] relative text-darkgray-100 text-left inline-block p-0"
                      placeholder="Reenter new password"
                      type="text"
                    />
                  </div>
                  <div className="self-stretch flex flex-row items-start justify-end py-[0rem] pl-[6.187rem] pr-[6.125rem] mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border">
                    <button className="cursor-pointer [border:none] pt-[0.687rem] pb-[0.625rem] pl-[2.687rem] pr-[2.562rem] bg-darkslateblue-100 rounded-11xl overflow-hidden flex flex-row items-start justify-start hover:bg-cornflowerblue">
                      <div className="relative text-[0.938rem] font-inter text-white text-left inline-block min-w-[3.563rem]">
                        Change
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <img
              className="h-[1.563rem] w-[1.563rem] relative rounded-3xs overflow-hidden shrink-0"
              loading="lazy"
              alt=""
              src="/frame.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

MainContent.propTypes = {
  className: PropTypes.string,
};

export default MainContent;
