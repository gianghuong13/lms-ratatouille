import SideBar from './SideBar';
import MainContent from './MainContent';

const Me = () => {
  return (
    <div className="w-full relative bg-whitesmoke-100 overflow-hidden flex flex-row items-start justify-start gap-[1.437rem] leading-[normal] tracking-[normal] mq1300:flex-wrap">
      <SideBar />
      <main className="h-[51.063rem] w-[72.313rem] flex flex-col items-start justify-start pt-[1.312rem] px-[0rem] pb-[0rem] box-border max-w-full">
        <section className="self-stretch flex-1 flex flex-col items-start justify-start gap-[1.125rem] max-w-full text-left text-[2rem] text-black font-inter">
          <div className="flex flex-row items-start justify-start py-[0rem] pl-[1.312rem] pr-[1.25rem]">
            <a className="[text-decoration:none] relative font-bold text-[inherit] inline-block min-w-[3.125rem] mq800:text-[1.625rem] mq450:text-[1.188rem]">{`Me `}</a>
          </div>
          <MainContent />
        </section>
      </main>
    </div>
  );
};

export default Me;
