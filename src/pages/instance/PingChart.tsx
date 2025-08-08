import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex, SegmentedControl, Card, Switch, Button } from "@radix-ui/themes";
import { usePublicInfo } from "@/contexts/PublicInfoContext";
import Loading from "@/components/loading";
import { ChartContainer } from "@/components/ui/chart";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import ApexCharts from "apexcharts";
import { useTheme } from "next-themes";

import fillMissingTimePoints, {
  cutPeakValues,
  calculateLossRate,
} from "@/utils/RecordHelper";
import Tips from "@/components/ui/tips";
import { Eye, EyeOff } from "lucide-react";

interface PingRecord {
  client: string;
  task_id: number;
  time: string;
  value: number;
}
interface TaskInfo {
  id: number;
  name: string;
  interval: number;
}
interface PingApiResp {
  status: string;
  message: string;
  data: {
    count: number;
    records: PingRecord[];
    tasks: TaskInfo[];
  };
}

//const MAX_POINTS = 1000;

const colors = [
  "#0A84FF",
  "#30D158",
  "#FF9F0A",
  "#FF375F",
  "#5E5CE6",
  "#64D2FF",
  "#BF5AF2",
  "#FFD60A",
];
  const chartId = "pingchart";


const PingChart = ({ uuid }: { uuid: string }) => {
  const { t } = useTranslation();
  const { publicInfo } = usePublicInfo();
  const max_record_preserve_time = publicInfo?.ping_record_preserve_time || 0;
  // 视图选项
  const presetViews = [
    { label: t("chart.hours", { count: 1 }), hours: 1 },
    { label: t("chart.hours", { count: 6 }), hours: 6 },
    { label: t("chart.hours", { count: 12 }), hours: 12 },
    { label: t("chart.days", { count: 1 }), hours: 24 },
  ];
  const avaliableView: { label: string; hours?: number }[] = [];
  if (
    typeof max_record_preserve_time === "number" &&
    max_record_preserve_time > 0
  ) {
    for (const v of presetViews) {
      if (max_record_preserve_time >= v.hours) {
        avaliableView.push({ label: v.label, hours: v.hours });
      }
    }
    const maxPreset = presetViews[presetViews.length - 1];
    if (max_record_preserve_time > maxPreset.hours) {
      avaliableView.push({
        label: `${t("chart.hours", { count: max_record_preserve_time })}`,
        hours: max_record_preserve_time,
      });
    } else if (
      max_record_preserve_time > 1 &&
      !presetViews.some((v) => v.hours === max_record_preserve_time)
    ) {
      avaliableView.push({
        label: `${t("chart.hours", { count: max_record_preserve_time })}`,
        hours: max_record_preserve_time,
      });
    }
  }

  // 默认视图设为1小时
  const initialView =
    avaliableView.find((v) => v.hours === 1)?.label ||
    avaliableView[0]?.label ||
    "";
  const [view, setView] = useState<string>(initialView);
  const [hours, setHours] = useState<number>(
    avaliableView.find((v) => v.label === initialView)?.hours || 1
  ); // Add hours state

  const [remoteData, setRemoteData] = useState<PingRecord[] | null>(null);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cutPeak, setCutPeak] = useState(false); // 平滑开关，默认关闭

  // Update hours state when view changes
  useEffect(() => {
    const selected = avaliableView.find((v) => v.label === view);
    if (selected && selected.hours !== undefined) {
      setHours(selected.hours);
    }
  }, [view, avaliableView]);

  // 拉取历史数据
  useEffect(() => {
    if (!uuid) return;
    if (!hours) {
      // Use hours directly
      setRemoteData(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/records/ping?uuid=${uuid}&hours=${hours}`) // Use hours directly
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((resp: PingApiResp) => {
        const records = resp.data?.records || [];
        records.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        setRemoteData(records);
        setTasks(resp.data?.tasks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setLoading(false);
      });
  }, [hours, uuid]); // Depend on hours

  const midData = useMemo(() => {
    const data = remoteData || [];
    if (!data.length) return [];

    const grouped: Record<string, any> = {};
    const timeKeys: number[] = [];

    //for (const rec of sliced) {
    for (const rec of data) {
      const t = new Date(rec.time).getTime();
      let foundKey = null;
      for (const key of timeKeys) {
        if (Math.abs(key - t) <= 1500) {
          foundKey = key;
          break;
        }
      }
      const useKey = foundKey !== null ? foundKey : t;
      if (!grouped[useKey]) {
        grouped[useKey] = { time: new Date(useKey).toISOString() };
        if (foundKey === null) timeKeys.push(useKey);
      }
      grouped[useKey][rec.task_id] = rec.value;
    }

    let full = Object.values(grouped).sort(
      (a: any, b: any) =>
        new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    const full1 = fillMissingTimePoints(
      full,
      tasks[0]?.interval || 60,
      hours * 60 * 60,
      tasks[0]?.interval ? tasks[0]?.interval * 1.2 : 60 * 1.2
    );
    return full1;
  }, [remoteData, cutPeak, tasks, hours]);

  // 组装图表数据
  const chartData = useMemo(() => {
    let full = midData;
    if (cutPeak && tasks.length > 0) {
      const taskKeys = tasks.map((task) => String(task.id));
      full = cutPeakValues(midData, taskKeys);
    }
    return full;
  }, [remoteData, cutPeak, tasks, hours]);

  // ApexCharts series
  const series = useMemo(() => {
    return tasks.map((task, idx) => ({
      name: task.name,
      data: chartData.map((d: any) => ({ x: new Date(d.time).getTime(), y: d[task.id] ?? null })),
      color: colors[idx % colors.length],
    }));
  }, [tasks, chartData]);



  // 颜色配置
  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {};
    tasks.forEach((task, idx) => {
      config[task.id] = {
        label: task.name,
        color: colors[idx % colors.length],
      };
    });
    return config;
  }, [tasks]);

  const { theme } = useTheme();


  const options: ApexOptions = useMemo(() => ({
    chart: {
      id: chartId,

      type: "line",
      toolbar: { show: false },
      animations: { enabled: false },
      stacked: false,
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 2,
        color: theme === "dark" ? "#000" : "#000",
        opacity: theme === "dark" ? 0.35 : 0.08,
      },
    },
    fill: { type: 'solid', opacity: 0 },

    theme: { mode: theme === "dark" ? "dark" : "light" },
    stroke: {
      curve: cutPeak ? 'smooth' : 'straight',
      width: 2.5,
      lineCap: 'round',
    },
    markers: {
      size: 0,
      hover: { size: 5 },
      strokeWidth: 0,
    },
    grid: {
      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {


      type: "datetime",
      labels: {
        formatter: (val: string, timestamp?: number) => {
          const ts = timestamp ?? Number(val);
          const date = new Date(ts);
          if (hours < 24) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
          return date.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
        },
      },
    },
    yaxis: { labels: { formatter: (v: number) => `${Math.round(Number(v))} ms` } },
    tooltip: {
      shared: true,
      x: {
        formatter: (val: number) => {
          const date = new Date(val);
          if (hours < 24) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          }
          return date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
        },
      },
      y: { formatter: (v?: number) => (v == null ? "-" : `${Math.round(Number(v))} ms`) },
    },
    legend: { show: true },
    noData: { text: t("common.none") },
    colors: colors,
  }), [theme, cutPeak, hours, t]);

  const latestValues = useMemo(() => {
    if (!remoteData || !tasks.length) return [];
    const map = new Map<number, PingRecord>();
    for (let i = remoteData.length - 1; i >= 0; i--) {
      const rec = remoteData[i];
      if (!map.has(rec.task_id)) {
        map.set(rec.task_id, rec);
      }
    }
    return tasks.map((task, idx) => ({
      ...task,
      value: map.get(task.id)?.value ?? null,
      time: map.get(task.id)?.time ?? null,
      color: colors[idx % colors.length],
    }));
  }, [remoteData, tasks]);

  const [allHidden, setAllHidden] = useState(false);

  const toggleAllLines = useCallback(() => {
    if (!tasks.length) return;
    if (allHidden) {
      tasks.forEach((task) => ApexCharts.exec(chartId, 'showSeries', task.name));
      setAllHidden(false);
    } else {
      tasks.forEach((task) => ApexCharts.exec(chartId, 'hideSeries', task.name));
      setAllHidden(true);
    }
  }, [allHidden, tasks]);

  useEffect(() => {
    // 当任务或时间范围变化时，默认显示所有序列
    tasks.forEach((task) => ApexCharts.exec(chartId, 'showSeries', task.name));
    setAllHidden(false);
  }, [tasks, hours]);

  return (
    <Flex direction="column" align="center" gap="4" className="w-full max-w-screen">
      <div className="overflow-x-auto w-full flex items-center justify-center">
        <SegmentedControl.Root
          value={view}
          onValueChange={(newView) => {
            setView(newView);
            const selected = avaliableView.find((v) => v.label === newView);
            if (selected && selected.hours !== undefined) {
              setHours(selected.hours);
            }
          }}
        >
          {avaliableView.map((v) => (
            <SegmentedControl.Item
              key={v.label}
              value={v.label}
              className="capitalize"
            >
              {v.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>

      {loading && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <Loading />
        </div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", width: "100%" }}>
          {error}
        </div>
      )}
      {latestValues.length > 0 ? (
        <Card className="w-full max-w-[900px] mb-2">
          <Tips className="absolute top-0 right-0 m-2">
            <label>
              {t("chart.loss_tips")}
            </label>
          </Tips>
          <div
            className="grid gap-2 mb-2 w-full"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(240px,1fr))`,
            }}
          >
            {latestValues.map((task) => (
              <div key={task.id} className="flex flex-row items-center rounded">
                <div
                  className="w-1 h-6 rounded-xs "
                  style={{ backgroundColor: task.color }}
                />
                <div className="flex items-start justify-center ml-1 flex-col">
                  <label className="font-bold text-md -mb-1">{task.name}</label>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>
                      {task.value !== null ? `${task.value} ms` : "-"}
                    </span>
                    <span>
                      {chartData && chartData.length > 0
                        ? `${calculateLossRate(midData, task.id)}%${t("chart.lossRate")}`
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="w-full max-w-[900px] text-center text-muted-foreground mb-2">
          {t("common.none")}
        </div>
      )}
      <Card className="w-full max-w-[900px]">
        {chartData.length === 0 ? (
          <div className="w-full h-40 flex items-center justify-center text-muted-foreground">
            {t("common.none")}
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={360}
              width="100%"
            />
          </ChartContainer>
        )}
        {/* Cut Peak 开关和显示/隐藏所有按钮 */}
        <div
          className="flex items-center justify-between gap-4"
          style={{ display: loading ? "none" : "flex" }}
        >
          <div className="flex items-center gap-2">
            <Switch
              id="cut-peak"
              checked={cutPeak}
              onCheckedChange={setCutPeak}
            />
            <label htmlFor="cut-peak" className="text-sm font-medium flex items-center gap-1 flex-row">
              {t("chart.cutPeak")}
              <Tips><span dangerouslySetInnerHTML={{ __html: t("chart.cutPeak_tips") }} /></Tips>
            </label>
          </div>
          <Button
            variant="soft"
            size="2"
            onClick={toggleAllLines}
            className="flex items-center gap-2"
          >
            {allHidden ? (
              <>
                <Eye size={16} />
                {t("chart.showAll")}
              </>
            ) : (
              <>
                <EyeOff size={16} />
                {t("chart.hideAll")}
              </>
            )}
          </Button>
        </div>
      </Card>
    </Flex>
  );
};

export default PingChart;
