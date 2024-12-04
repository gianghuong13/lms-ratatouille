export default function PageTitle(props){
    return(
        <div className="pt-1 pb-2">
            <h1 className="text-3xl font-bold sm:mx-2 md:mx-3 xl:ml-5 font-sans m-0 inline-block">{props.title}</h1>
            <span className="text-gray-400">{props.at}</span>
        </div>
    );
}