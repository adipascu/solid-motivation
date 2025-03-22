import type { Temporal } from "temporal-polyfill";

export const AGE = "年龄";
export const SOURCE_CODE = "源代码";
export const COPY_LABEL = "点击将年龄复制到剪贴板";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `生日：${birthDay.toLocaleString()}`;
export const AGE_COPIED = "年龄已复制到剪贴板！";
export const AGE_COPY_FAILED = "无法将年龄复制到剪贴板！";
export const ENTER_BIRTHDAY = "请输入您的生日";
export const MOTIVATE = "激励";
