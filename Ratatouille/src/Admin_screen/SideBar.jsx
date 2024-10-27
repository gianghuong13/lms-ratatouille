import PropTypes from "prop-types";

const SideBar = ({ className = "" }) => {
  return (
    <div
      className={`w-[12.25rem] bg-lightblue overflow-hidden shrink-0 flex flex-row items-start justify-start pt-[1.562rem] px-[0.937rem] pb-[39.625rem] box-border gap-[18.625rem] text-left text-[1rem] text-black font-inter mq450:pb-[16.75rem] mq450:box-border mq1125:pt-[1.25rem] mq1125:pb-[25.75rem] mq1125:box-border ${className}`}
    >
      <div className="w-[10.375rem] flex flex-col items-start justify-start gap-[1.437rem] shrink-0">
        <div className="flex flex-row items-start justify-start py-[0rem] pl-[2.25rem] pr-[2.5rem]">
          <img
            className="h-[5.625rem] w-[5.625rem] relative object-cover"
            loading="lazy"
            alt=""
            src="/logodhcongngheuet-1@2x.png"
          />
        </div>
        <div className="self-stretch overflow-hidden flex flex-col items-end justify-start py-[0.062rem] px-[0rem] gap-[1.65rem]">
          <div className="w-[10.688rem] rounded-20xl overflow-hidden flex flex-row items-start justify-start py-[0.562rem] px-[1.25rem] box-border relative gap-[0.881rem]">
            <img
              className="h-[1.219rem] w-[1.306rem] relative"
              loading="lazy"
              alt=""
              src="/vector.svg"
            />
            <div className="flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
              <a className="[text-decoration:none] relative text-[inherit]">
                Home
              </a>
            </div>
            <footer className="h-[55.25rem] w-[76.063rem] absolute !m-[0] right-[-78.562rem] bottom-[-52.875rem] overflow-hidden shrink-0 z-[1]" />
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pl-[0.875rem] pr-[0rem] gap-[0.75rem]">
            <div className="flex flex-col items-end justify-start gap-[2.112rem]">
              <div className="flex flex-row items-start justify-end py-[0rem] pl-[0.125rem] pr-[0.062rem]">
                <img
                  className="h-[1.219rem] w-[1.25rem] relative"
                  loading="lazy"
                  alt=""
                  src="/group.svg"
                />
              </div>
              <div className="flex flex-col items-end justify-start gap-[1.812rem]">
                <img
                  className="w-[1.438rem] h-[1.188rem] relative"
                  alt=""
                  src="/vector-1.svg"
                />
                <div className="flex flex-row items-start justify-end py-[0rem] pl-[0.125rem] pr-[0.062rem]">
                  <img
                    className="h-[1.25rem] w-[1.25rem] relative overflow-hidden shrink-0"
                    loading="lazy"
                    alt=""
                    src="/bell.svg"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start justify-start gap-[2.062rem]">
              <div className="w-[5.45rem] flex flex-row items-start justify-start py-[0rem] px-[0.062rem] box-border">
                <div className="flex-1 relative">Classes</div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[1.75rem]">
                <div className="w-[5.788rem] flex flex-row items-start justify-start py-[0rem] pl-[0.125rem] pr-[0.062rem] box-border">
                  <div className="flex-1 relative">Accounts</div>
                </div>
                <div className="self-stretch relative">Notifications</div>
              </div>
            </div>
          </div>
          <div className="self-stretch rounded-11xl bg-white overflow-hidden flex flex-row items-start justify-start pt-[0.437rem] px-[0.937rem] pb-[0.687rem] gap-[0.875rem]">
            <img
              className="h-[1.25rem] w-[1.25rem] relative overflow-hidden shrink-0"
              alt=""
              src="/me.svg"
            />
            <div className="relative">Me</div>
          </div>
        </div>
      </div>
      <header className="flex flex-col items-start justify-start pt-[1.562rem] px-[0rem] pb-[0rem] box-border max-w-[235%] text-left text-[2.25rem] text-black font-inter">
        <h1 className="m-0 relative text-inherit font-bold font-[inherit] shrink-0 whitespace-nowrap">
          Account Management
        </h1>
      </header>
      <div className="h-[55.375rem] w-[75.938rem] relative overflow-hidden shrink-0 hidden max-w-full" />
    </div>
  );
};

SideBar.propTypes = {
  className: PropTypes.string,
};

export default SideBar;
