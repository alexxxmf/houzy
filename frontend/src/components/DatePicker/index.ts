import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import "antd/es/date-picker/style/index";

// On swapping MomentJS with DayJS
// https://ant.design/docs/react/replace-moment
export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
