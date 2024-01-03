import Palette from "./Palette";
import { useState } from "react";

export default function SearchBar() {

    const [open, setOpen] = useState(false);

    return(<>
    <button onClick={() => setOpen(true)}>Pesquisar</button>
        <Palette open={open} setOpen={setOpen} />
    </>)
}