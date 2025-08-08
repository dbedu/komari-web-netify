import { useEffect, useMemo, useState } from "react";
import { Card, Switch } from "@radix-ui/themes";
import Loading from "@/components/loading";
import { ChartContainer } from "@/components/ui/chart";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import fillMissingTimePoints, { cutPeakValues } from "@/utils/RecordHelper";
import Tips from "./ui/tips";
import { useTheme } from "next-themes";

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
  "#F38181",
  "#347433",
  "#898AC4",
  "#03A6A1",
  "#7AD6F0",
  "#B388FF",
  "#FF8A65",
  "#FFD600",
];

interface MiniPingChartProps {
  uuid: string;
  width?: string | number;
  height?: string | number;
  hours?: number; // Add hours as an optional prop
}

const MiniPingChart = ({
  uuid,
  width = "100%",
  height = 300,
  hours = 12,
}: MiniPingChartProps) => {
  const [remoteData, setRemoteData] = useState<PingRecord[] | null>(null);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [t] = useTranslation();
  const [cutPeak, setCutPeak] = useState(false);
  useEffect(() => {
    if (!uuid) return;

    setLoading(true);
    setError(null);
    fetch(`/api/records/ping?uuid=${uuid}&hours=${hours}`)
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
  }, [uuid, hours]);

  const chartData = useMemo(() => {
    const data = remoteData || [];
    if (!data.length) return [];
    //const sliced = data.slice(-MAX_POINTS);
    const grouped: Record<string, any> = {};
    const timeKeys: number[] = [];

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

    // 如果开启削峰，应用削峰处理
    if (cutPeak && tasks.length > 0) {
      const taskKeys = tasks.map(task => String(task.id));
      full = cutPeakValues(full, taskKeys);
    }

    const full1 = fillMissingTimePoints(full, tasks[0]?.interval || 60, null, tasks[0]?.interval * 1.2 || 72);
    return full1;
  }, [remoteData, cutPeak, tasks]);



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

  // ApexCharts series
  const series = useMemo(() => {
    return tasks.map((task, idx) => ({
      name: task.name,
      data: chartData.map((d: any) => ({ x: new Date(d.time).getTime(), y: d[task.id] ?? null })),
      color: colors[idx % colors.length],
    }));
  }, [tasks, chartData]);

  const { theme } = useTheme();

  const options: ApexOptions = useMemo(() => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: false },
      stacked: false,
      zoom: { enabled: false },
      foreColor: undefined,
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    stroke: { curve: cutPeak ? "smooth" : "straight", width: 2 },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (val: string, timestamp?: number) => {
          const ts = timestamp ?? Number(val);
          const date = new Date(ts);
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { formatter: (v: number) => `${Math.round(Number(v))} ms` },
    },
    tooltip: {
      shared: true,
      x: {
        formatter: (val: number) => {
          const date = new Date(val);
          return date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
        },
      },
      y: { formatter: (v?: number) => (v == null ? "-" : `${Math.round(Number(v))} ms`) },
    },
    legend: { show: true },
    noData: { text: t("common.none") },
  }), [cutPeak, t, theme]);

  return (
    <Card style={{ width, height }} className="flex flex-col">
      {loading && (
        <div
          style={{
            textAlign: "center",
            width: "100%",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      )}
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            width: "100%",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {error}
        </div>
      )}
      {!loading && !error && chartData.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          {t("common.none")}
        </div>
      ) : (
        !loading &&
        !error && (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height="100%"
              width="100%"
            />
          </ChartContainer>
        )
      )}
      <div className="-mt-3 flex items-center" style={{ display: loading ? "none" : "flex" }}>
        <Switch size="1" checked={cutPeak} onCheckedChange={setCutPeak} />
        <label htmlFor="cut-peak" className="text-sm font-medium flex items-center gap-1 flex-row">
          {t("chart.cutPeak")}
          <Tips side="top"><span dangerouslySetInnerHTML={{ __html: t("chart.cutPeak_tips") }} /></Tips>
        </label>

      </div>
    </Card>
  );
};

export default MiniPingChart;
