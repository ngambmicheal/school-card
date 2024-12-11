import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react"
import Link from "next/link";


type DropdownProps = {
    buttonTitle?:string,
    hasSession?:boolean,
    isAdmin?:boolean,
    items:{
        name:string,
        action:()=>void,
        href?:string, 
        needsAdmin?:boolean
        needsSession?:boolean,
        className?:string,
    }[]
}

export default function Dropdown({items, buttonTitle}:DropdownProps){ 
    return <Menu>
      <MenuButton as={Button}>
        {buttonTitle ?? 'Actions'}
      </MenuButton>
      <MenuList>
        {items.map((item, index) => (
          <MenuItem key={index} onClick={item.action} className={item.className}>
            {item.href ? <Link href={item.href} >{item.name}</Link> : item.name}
          </MenuItem>
        ))}
    </MenuList>
    </Menu>
}