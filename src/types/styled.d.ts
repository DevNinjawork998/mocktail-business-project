import "styled-components";
import { StyledTheme } from "@/theme/styled-theme";

declare module "styled-components" {
   
  export interface DefaultTheme extends StyledTheme {}
}
