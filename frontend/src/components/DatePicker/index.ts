import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";
import "antd/lib/date-picker/style/index";

// https://github.com/ant-design/ant-design/issues/23365
// On swapping MomentJS with DayJS
// https://ant.design/docs/react/replace-moment
export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
