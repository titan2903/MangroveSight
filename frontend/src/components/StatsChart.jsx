import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

/* ─── Custom Tooltip for Line Chart ─── */
const LineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #00BFA5",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#004D40",
            fontWeight: "bold",
            display: "block",
            mb: 0.5,
          }}
        >
          Tahun {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "#004D40" }}>
          <strong>
            {payload[0].value.toLocaleString("id-ID", {
              maximumFractionDigits: 2,
            })}{" "}
            ha
          </strong>
        </Typography>
      </Box>
    );
  }
  return null;
};

/* ─── Custom Tooltip for Bar Chart ─── */
const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <Box
        sx={{
          bgcolor: "white",
          border: `1px solid ${val >= 0 ? "#00BFA5" : "#EF5350"}`,
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#455a64",
            fontWeight: "bold",
            display: "block",
            mb: 0.5,
          }}
        >
          Tahun {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: val >= 0 ? "#00695C" : "#c62828", fontWeight: "bold" }}
        >
          {val > 0 ? "+" : ""}
          {val.toLocaleString("id-ID", { maximumFractionDigits: 2 })} ha
        </Typography>
      </Box>
    );
  }
  return null;
};

/* ─── Summary Card Component ─── */
const SummaryCard = ({
  label,
  value,
  unit,
  year,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      bgcolor: bgColor,
      border: `1px solid ${borderColor}`,
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      height: "100%",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: `0 8px 24px ${borderColor}60`,
      },
    }}
  >
    <Box
      sx={{
        p: 1.2,
        borderRadius: 2.5,
        bgcolor: `${color}18`,
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color, fontSize: 24 }} />
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "#78909c",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {year && <span style={{ fontWeight: 400 }}>({year})</span>}
      </Typography>
      <Typography
        variant="h5"
        sx={{ color, fontWeight: 900, mt: 0.5, lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "#90a4ae" }}>
        {unit}
      </Typography>
    </Box>
  </Paper>
);

/* ─── Main Component ─── */
const StatsChart = ({ stats }) => {
  if (!stats || !stats.epochs || stats.epochs.length === 0) {
    return <Typography>Data tidak tersedia.</Typography>;
  }

  const chartData = stats.epochs.map((epoch) => ({
    year: epoch.year,
    area: epoch.area_ha,
    delta: epoch.delta_ha ?? 0,
  }));

  const summary = stats.summary || {};
  const netDelta = summary.net_change_2007_to_2022?.delta_ha;

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Summary Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Luas Tertinggi"
            year={summary.max_area?.year}
            value={summary.max_area?.area_ha.toLocaleString("id-ID", {
              maximumFractionDigits: 2,
            })}
            unit="hektar"
            icon={TrendingUpIcon}
            color="#00695C"
            bgColor="#E0F2F1"
            borderColor="#80CBC4"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Luas Terendah"
            year={summary.min_area?.year}
            value={summary.min_area?.area_ha.toLocaleString("id-ID", {
              maximumFractionDigits: 2,
            })}
            unit="hektar"
            icon={TrendingDownIcon}
            color="#c62828"
            bgColor="#FFEBEE"
            borderColor="#EF9A9A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Net Change"
            year="2007–2022"
            value={`${netDelta > 0 ? "+" : ""}${netDelta?.toLocaleString("id-ID", { maximumFractionDigits: 2 })}`}
            unit={`hektar (${summary.net_change_2007_to_2022?.delta_pct}%)`}
            icon={SwapVertIcon}
            color={netDelta >= 0 ? "#1565C0" : "#6A1B9A"}
            bgColor="#EDE7F6"
            borderColor="#CE93D8"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Penurunan Terbesar"
            year={summary.biggest_loss_epoch?.year}
            value={summary.biggest_loss_epoch?.delta_ha?.toLocaleString(
              "id-ID",
              { maximumFractionDigits: 2 },
            )}
            unit="hektar"
            icon={WarningAmberIcon}
            color="#E65100"
            bgColor="#FFF3E0"
            borderColor="#FFCC80"
          />
        </Grid>
      </Grid>

      {/* ── Divider ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Divider sx={{ flex: 1, borderColor: "#b2dfdb" }} />
        <Typography
          variant="caption"
          sx={{
            color: "#78909c",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
            whiteSpace: "nowrap",
          }}
        >
          Visualisasi Data
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "#b2dfdb" }} />
      </Box>

      {/* ── Charts ── */}
      <Grid container spacing={4}>
        {/* Line Chart */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 20px rgba(0,77,64,0.06)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#004D40", fontWeight: 800 }}
              >
                Tren Luas Area Mangrove
              </Typography>
              <Typography variant="body2" sx={{ color: "#90a4ae", mt: 0.5 }}>
                Total luas kawasan mangrove per tahun observasi (dalam hektar)
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e8f5e9" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#78909c", fontSize: 13 }}
                    tickMargin={12}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 80", "dataMax + 80"]}
                    tickFormatter={(v) => v.toLocaleString("id-ID")}
                    tick={{ fill: "#78909c", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={88}
                  />
                  <RechartsTooltip content={<LineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="area"
                    name="Luas (ha)"
                    stroke="#00BFA5"
                    strokeWidth={3.5}
                    dot={{
                      r: 5,
                      fill: "#004D40",
                      stroke: "#00BFA5",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 8,
                      fill: "#004D40",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 20px rgba(0,77,64,0.06)",
            }}
          >
            <Box
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#004D40", fontWeight: 800 }}
                >
                  Perubahan Luas per Periode (Δ ha)
                </Typography>
                <Typography variant="body2" sx={{ color: "#90a4ae", mt: 0.5 }}>
                  Selisih luas kawasan antara dua epoch yang berurutan
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      bgcolor: "#00BFA5",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#455a64", fontWeight: 600 }}
                  >
                    Gain
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      bgcolor: "#EF5350",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#455a64", fontWeight: 600 }}
                  >
                    Loss
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ width: "100%", height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.slice(1)}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                  barSize={36}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#f5f5f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#78909c", fontSize: 13 }}
                    tickMargin={12}
                    axisLine={{ stroke: "#e0e0e0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString("id-ID")}
                    tick={{ fill: "#78909c", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <RechartsTooltip
                    content={<BarTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <ReferenceLine y={0} stroke="#b0bec5" strokeDasharray="4 4" />
                  <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                    {chartData.slice(1).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.delta >= 0 ? "#00BFA5" : "#EF5350"}
                        fillOpacity={0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsChart;
