import "../../../styles/admin/search.css"
import '@fortawesome/fontawesome-free'
function Search(){
    return (
        <div className='search'>
            <input type="text" placeholder="Search ..."/>
            <i className="fa-solid fa-magnifying-glass"></i>
        </div>
    );
}
export default Search