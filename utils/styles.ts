import serverPath, { base64_encode } from "../services/serverpath"

const logo = base64_encode(serverPath('/assets/images/smc/logo.png'));

console.log(logo)

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

`