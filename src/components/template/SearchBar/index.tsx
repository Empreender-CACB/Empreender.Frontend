import Palette from "./Palette";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
export default function SearchBar() {

    const [open, setOpen] = useState(false);

    return(<>
               
    
    <button className={'text-2xl'} onClick={() => setOpen(true)}><HiOutlineSearch /></button>
        <Palette open={open} setOpen={setOpen} />
    </>)
}