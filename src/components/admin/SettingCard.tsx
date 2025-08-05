import {
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Switch,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // 引入 Framer Motion

interface SettingCardProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bordless?: boolean;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  onHeaderClick?: () => void;
}

export function SettingCard({
  title = "",
  description = "",
  children,
  className = "",
  direction = "column",
  bordless = false,
  onHeaderClick = () => {},
}: SettingCardProps) {
  const actionChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Action
  );

  const otherChildren = React.Children.toArray(children).filter(
    (child) => !(React.isValidElement(child) && child.type === Action)
  );

  return (
    <Flex
      direction={direction}
      justify="between"
      align="center"
      wrap="wrap"
      style={{ borderColor: "var(--gray-a5)" }}
      className={
        bordless
          ? "border-0"
          : "border-1 rounded-md py-2 px-4 bg-transparent  min-h-8" + className
      }
    >
      <Flex
        className="w-full"
        direction="row"
        justify="between"
        align="center"
        wrap="nowrap"
        onClick={onHeaderClick}
      >
        <Flex
          direction="column"
          gap="1"
          className="min-h-10"
          justify={"center"}
        >
          <label className="text-base font-medium" style={{ fontWeight: 600 }}>
            {title}
          </label>
          {description && (
            <label className="text-sm text-muted-foreground">
              {description}
            </label>
          )}
        </Flex>
        {actionChild}
      </Flex>
      {otherChildren}
    </Flex>
  );
}

function Action({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

SettingCard.Action = Action;

export function SettingCardSwitch({
  label = "",
  autoDisabled = true,
  defaultChecked,
  onChange,
  ...props
}: SettingCardProps & {
  label?: string;
  autoDisabled?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, switchElement: HTMLButtonElement) => void;
}) {
  const switchRef = React.useRef<HTMLButtonElement>(null);
  const [disabled, setDisabled] = React.useState(false);
  const [checked, setChecked] = React.useState(defaultChecked || false);
  const handleChange = (c: boolean) => {
    if (autoDisabled) setDisabled(true);
    const previousValue = checked;
    setChecked(c);
    const result: any =
      onChange && switchRef.current
        ? onChange(c, switchRef.current)
        : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise
          .then(() => {})
          .catch(() => {
            setChecked(previousValue);
          })
          .finally(() => {
            setDisabled(false);
          });
      } else {
        setDisabled(false);
      }
    }
  };
  return (
    <SettingCard {...props} direction="column">
      <SettingCard.Action>
        <Flex direction="row" gap="2" align="center">
          <label>{label}</label>
          <Switch
            ref={switchRef}
            checked={checked}
            onCheckedChange={handleChange}
            disabled={disabled}
          />
        </Flex>
      </SettingCard.Action>
    </SettingCard>
  );
}

export function SettingCardButton({
  label = "",
  variant = "solid",
  children,
  onClick,
  autoDisabled = true,
  ...props
}: SettingCardProps & {
  label?: string;
  variant?: "solid" | "soft" | "outline" | "ghost";
  children?: React.ReactNode;
  onClick?: (buttonElement: HTMLButtonElement) => void;
  autoDisabled?: boolean;
}) {
  const [disabled, setDisabled] = React.useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (autoDisabled) setDisabled(true);
    const result: any = onClick ? onClick(event.currentTarget) : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise.finally(() => setDisabled(false));
      } else {
        setDisabled(false);
      }
    }
  };
  return (
    <SettingCard {...props} direction="column">
      <SettingCard.Action>
        <Flex>
          <Flex direction="row" gap="2" align="center">
            <label>{label}</label>
            <Button onClick={handleClick} variant={variant} disabled={disabled}>
              {children}
            </Button>
          </Flex>
        </Flex>
      </SettingCard.Action>
    </SettingCard>
  );
}

export function SettingCardIconButton({
  label = "",
  variant = "solid",
  children,
  onClick,
  autoDisabled = true,
  ...props
}: SettingCardProps & {
  label?: string;
  variant?: "solid" | "soft" | "outline" | "ghost";
  children?: React.ReactNode;
  onClick?: (buttonElement: HTMLButtonElement) => void;
  autoDisabled?: boolean;
}) {
  const [disabled, setDisabled] = React.useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (autoDisabled) setDisabled(true);
    const result: any = onClick ? onClick(event.currentTarget) : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise.finally(() => setDisabled(false));
      } else {
        setDisabled(false);
      }
    }
  };
  return (
    <SettingCard {...props} direction="column">
      <SettingCard.Action>
        <Flex>
          <Flex direction="row" gap="2" align="center">
            <label>{label}</label>
            <IconButton
              onClick={handleClick}
              variant={variant}
              disabled={disabled}
            >
              {children}
            </IconButton>
          </Flex>
        </Flex>
      </SettingCard.Action>
    </SettingCard>
  );
}

export function SettingCardShortTextInput({
  title = "",
  description = "",
  label = useTranslation().t("save"),
  defaultValue = "",
  number = false,
  OnSave = () => {},
  autoDisabled = true,
  isSaving,
  bordless = false,
}: {
  title?: string;
  description?: string;
  label?: string;
  defaultValue?: string;
  number?: boolean;
  OnSave?: (
    value: string,
    inputElement: HTMLInputElement,
    buttonElement: HTMLButtonElement
  ) => void;
  autoDisabled?: boolean;
  isSaving?: boolean;
  bordless?: boolean;
}) {
  const [disabled, setDisabled] = React.useState(false);
  const savingState = isSaving !== undefined ? isSaving : disabled;
  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleSave = () => {
    if (isSaving === undefined && autoDisabled) setDisabled(true);
    const result: any =
      inputRef.current && buttonRef.current
        ? OnSave(value, inputRef.current, buttonRef.current)
        : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise.finally(() => isSaving === undefined && setDisabled(false));
      } else {
        isSaving === undefined && setDisabled(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <SettingCard title={title} description={description} bordless={bordless}>
      <Flex direction="column" className="w-full mt-1" gap="2" align="start">
        <TextField.Root
          className="w-full"
          defaultValue={defaultValue}
          value={value}
          onChange={handleInputChange}
          type={number ? "number" : "text"}
          ref={inputRef}
        />
        <Button
          ref={buttonRef}
          onClick={handleSave}
          variant="solid"
          disabled={savingState}
        >
          {label}
        </Button>
      </Flex>
    </SettingCard>
  );
}

export function SettingCardLongTextInput({
  title = "",
  description = "",
  label = useTranslation().t("save"),
  defaultValue = "",
  OnSave = () => {},
  autoDisabled = true,
  isSaving,
  bordless = false,
}: {
  title?: string;
  description?: string;
  label?: string;
  defaultValue?: string;
  OnSave?: (
    value: string,
    textAreaElement: HTMLTextAreaElement,
    buttonElement: HTMLButtonElement
  ) => void;
  autoDisabled?: boolean;
  isSaving?: boolean;
  bordless?: boolean;
}) {
  const [disabled, setDisabled] = React.useState(false);
  const savingState = isSaving !== undefined ? isSaving : disabled;
  const [value, setValue] = React.useState(defaultValue);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleSave = () => {
    if (isSaving === undefined && autoDisabled) setDisabled(true);
    const result: any =
      textAreaRef.current && buttonRef.current
        ? OnSave(value, textAreaRef.current, buttonRef.current)
        : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise.finally(() => isSaving === undefined && setDisabled(false));
      } else {
        isSaving === undefined && setDisabled(false);
      }
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <SettingCard title={title} description={description} bordless={bordless}>
      <Flex direction="column" className="w-full mt-1" gap="2" align="start">
        <TextArea
          className="w-full"
          defaultValue={defaultValue}
          resize="vertical"
          value={value}
          onChange={handleTextAreaChange}
          ref={textAreaRef}
        />
        <Button
          ref={buttonRef}
          onClick={handleSave}
          variant="solid"
          disabled={savingState}
        >
          {label}
        </Button>
      </Flex>
    </SettingCard>
  );
}

export function SettingCardSelect({
  title,
  description,
  defaultValue = "",
  value,
  label = useTranslation().t("select"),
  options = [],
  OnSave = () => {},
  autoDisabled = true,
  isSaving,
  bordless = false,
}: {
  title?: string;
  description?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  options?: { value: string; label?: string; disabled?: boolean }[];
  OnSave?: (value: string, buttonElement: HTMLButtonElement) => void;
  autoDisabled?: boolean;
  isSaving?: boolean;
  bordless?: boolean;
}) {
  const [disabled, setDisabled] = React.useState(false);
  const savingState = isSaving !== undefined ? isSaving : disabled;
  const [selectedValue, setSelectedValue] = React.useState(
    value !== undefined ? value : defaultValue
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSave = (value: string) => {
    if (isSaving === undefined && autoDisabled) setDisabled(true);
    const previousValue = selectedValue; // 保存之前的值
    setSelectedValue(value); // 先更新选择的值

    const result: any = buttonRef.current
      ? OnSave(value, buttonRef.current)
      : undefined;
    if (autoDisabled) {
      const promise: Promise<any> = result;
      if (promise && typeof promise.then === "function") {
        promise
          .then(() => {
            // 成功时不需要额外操作，值已经更新
          })
          .catch(() => {
            // 错误时自动切换回之前的值
            setSelectedValue(previousValue);
          })
          .finally(() => {
            isSaving === undefined && setDisabled(false);
          });
      } else {
        isSaving === undefined && setDisabled(false);
      }
    }
  };

  // 获取要显示的文本，优先显示选择的值对应的标签
  const getDisplayText = () => {
    if (selectedValue) {
      const selectedOption = options.find(
        (option) => option.value === selectedValue
      );
      return selectedOption?.label || selectedValue;
    }
    return label;
  };

  return (
    <SettingCard title={title} description={description} bordless={bordless}>
      <SettingCard.Action>
        <Flex>
          <Flex direction="row" gap="2" align="center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger disabled={savingState}>
                <Button variant="soft" ref={buttonRef}>
                  {getDisplayText()}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {options.map((option) => (
                  <DropdownMenu.Item
                    disabled={option.disabled}
                    key={option.value}
                    onSelect={() => {
                      handleSave(option.value);
                    }}
                  >
                    {option.label ? option.label : option.value}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </SettingCard.Action>
    </SettingCard>
  );
}

export function SettingCardLabel({
  children,
}: {
  children: React.ReactNode | null;
}) {
  return (
    <label className="text-xl font-bold" style={{ fontWeight: 600 }}>
      {children}
    </label>
  );
}

export function SettingCardCollapse({
  title,
  description,
  defaultOpen = false,
  children,
  bordless = false,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  bordless?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SettingCard
      title={title}
      description={description}
      onHeaderClick={() => setOpen(!open)}
      bordless={bordless}
    >
      <SettingCard.Action>
        <IconButton
          variant="soft"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="collapsible-content"
        >
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: open ? 180 : 0, scale: open ? 1.1 : 1 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChevronDownIcon />
          </motion.div>
        </IconButton>
      </SettingCard.Action>
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-full p-0 md:p-1" // Ensures the content takes full width
            layout // Smoothly handles height changes
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }} // Prevents content clipping during animation
            id="collapsible-content"
          >
            <div className="border-t-1 my-2" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </SettingCard>
  );
}

// Header slot for SettingCardCollapse
SettingCardCollapse.Header = function Header({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
};
