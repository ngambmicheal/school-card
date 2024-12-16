import { logo } from "../assets/image";


export const bgImgStyle = `  
 
    .bg-logo{
        position:fixed;
        top:20%;
        background-image:url('data:image/jpeg;base64, ${logo}');
        background-position: 50% 0;
        background-repeat: no-repeat;
        background-size: contain;
        opacity:0.2;
        z-index:-1;
        width: 100%;
        height: 100%;
    }

    .table1, .table2, .table3{
        font-size:10px !important
    }

`