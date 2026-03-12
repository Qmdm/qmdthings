原文博客为[ggplot2](https://www.cedricscherer.com/2019/08/05/a-ggplot2-tutorial-for-beautiful-plotting-in-r/)
由衷感谢qwq

**内容目录**

- 准备
- 数据集
- ggplot2包
- 调整坐标轴
- 调整图表标题
- 调整图例（legend）
- 调整背景和网格线（background & grid line）
- 调整页边距
- 做多面板图
- 调整颜色
- 调整主题
- 调整线
- 调整文本
- 调整坐标
- 调整图表类型
- 调整条带
- 调整平滑线
- 做互作图

![图片overview](https://picx.zhimg.com/v2-5b06313f1e78d3fd21c7971c7cfc5e73_1440w.jpg)

## 准备

你需要安装以下包来执行代码，完成整个教程。

```{r}
# install CRAN packages
install.packages(c("tidyverse", "colorspace", "corrr",  "cowplot",
                   "ggdark", "ggforce", "ggrepel", "ggridges", "ggsci",
                   "ggtext", "ggthemes", "grid", "gridExtra", "patchwork",
                   "rcartocolor", "scico", "showtext", "shiny",
                   "plotly", "highcharter", "echarts4r"))

# install from GitHub since not on CRAN
install.packages(devtools)
devtools::install_github("JohnCoene/charter")
```

## 数据集

我们在本教程中使用来自空气污染致发病率和死亡率研究(nmaps)的数据。为了使作图易于管理，我们将数据限制在芝加哥1997-2000年间。关于这个数据集的更多细节，请参考Roger Peng的书《环境流行病学中的统计方法》。

我们可以使用readr包中read_csv()函数将数据导入到R中。为了以后访问数据，我们使用赋值箭头<-将数据存储在一个名为chic的变量中。

文中的数据集链接已经失效，评论区下面知友郭晋生提供的链接可以下载得到：

```r
chic <- readr::read_csv("https://raw.githubusercontent.com/Z3tt/R-Tutorials/master/ggplot2/chicago-nmmaps.csv")
tibble::glimpse(chic)
head(chic, 10)

## # A tibble: 10 x 10
##    city  date       death  temp dewpoint  pm10    o3  time season  year
##    <chr> <date>     <dbl> <dbl>    <dbl> <dbl> <dbl> <dbl> <chr>  <dbl>
##  1 chic  1997-01-01   137  36      37.5  13.1   5.66  3654 Winter  1997
##  2 chic  1997-01-02   123  45      47.2  41.9   5.53  3655 Winter  1997
##  3 chic  1997-01-03   127  40      38    27.0   6.29  3656 Winter  1997
##  4 chic  1997-01-04   146  51.5    45.5  25.1   7.54  3657 Winter  1997
##  5 chic  1997-01-05   102  27      11.2  15.3  20.8   3658 Winter  1997
##  6 chic  1997-01-06   127  17       5.75  9.36 14.9   3659 Winter  1997
##  7 chic  1997-01-07   116  16       7    20.2  11.9   3660 Winter  1997
##  8 chic  1997-01-08   118  19      17.8  33.1   8.68  3661 Winter  1997
##  9 chic  1997-01-09   148  26      24    12.1  13.4   3662 Winter  1997
## 10 chic  1997-01-10   121  16       5.38 24.8  10.4   3663 Winter  1997
```

ggplot2是一个基于图形语法的声明式创建图形的系统。你提供数据，告诉ggplot2如何将变量映射到美学（aesthetic），使用什么图形原语，然后它负责处理细节。

ggplot由几个基本元素构成：

1.  **数据** ：作图用的原始数据
2.  **几何图形 geom\_** :表示数据的几何形状
3.  **美学 aes()** : 几何或者统计对象的美学，比如位置，颜色，大小，形状等
4.  **刻度 scale\_()** : 数据与美学维度之间的映射，比如图形宽度的数据范围，
5.  **统计转换 stat\_** : 数据的统计，比如百分位，拟合曲线或者和
6.  **坐标系统 coord\_** : 数据的转换
7.  **面 facet\_** : 数据图表的排列
8.  **主题 theme()** : 图形的整体视觉默认值，如背景、网格、轴、默认字体、大小和颜色

```{r}
library(ggplot2)
library(tidyverse)
```

ggplot2的语法与base r不同。根据基本元素，默认的ggplot需要指定三样东西:

数据，美学和几何形状。

我们总是通过调用ggplot(data = df)来定义绘图对象，它只告诉ggplot2我们将处理该数据。在大多数情况下，你可能希望绘制两个变量——一个在x轴上，一个在y轴上，这些是位置美学，因此我们将aes(x = var1, y = var2)添加到ggplot()调用中(是的，aes()代表美学，放到aes内的变量，代表数据变量到位置美学的映射)。然而，也有一些情况需要指定一个甚至三个或更多的变量。

**我们在aes()外部指定数据,即chic，并将映射到美学的数据变量(即date和temp)添加到aes()内部**。

```r
g <- ggplot(chic, aes(x = date, y = temp))
```

![](https://pica.zhimg.com/v2-88a2e0ebe391c897a18d52698bab4aa8_1440w.jpg)

当运行时，只会创建一个面板。为什么?这是因为ggplot2不知道我们要如何绘制数据——我们仍然需要提供一个几何图形!

gplot2允许你将当前ggobject赋值给一个变量(在我们的例子中称为g)。稍后你可以通过添加其他层来扩展这个ggobject，要么一次性添加所有层，要么将其赋值给同一个或另一个变量。

有很多很多不同的几何图形(称为geoms，因为每个函数通常都以geom\_开头)，默认情况下可以添加到ggplot中，扩展包甚至提供更多的几何图形。让我们告诉ggplot2我们想使用哪种图形，例如通过添加geom_point()来创建散点图:

![](https://picx.zhimg.com/v2-962131a7a908ae83a666ed7eaa457a9d_1440w.jpg)

好了!但这些数据也可以被可视化为线形图(不是最优的，但人们总是这样做)。所以我们只需要添加geom_line():

![](https://pic1.zhimg.com/v2-2c6893ac583ee6def11a08f79e6cc4bc_1440w.jpg)

你还可以组合几个几何层——这就是魔法和乐趣的开始!

```{r}
g + geom_line() + geom_point()
```

![](https://pic1.zhimg.com/v2-c5d332827d2b5205e60e07d728d26e1a_1440w.jpg)

**调整几何图形的属性：**

在geom\_\*命令中，你可以操作视觉美学，如点的颜色、形状和大小。让我们把所有的点转换成大的火红色钻石!

```{r}
g + geom_point(color = "firebrick", shape = "diamond", size = 2)
```

![](https://pic1.zhimg.com/v2-b5118335191b89ec1fff860138ebdc90_1440w.jpg)

注意：你可以使用预设颜色或十六进制颜色代码，甚至可以使用RGB()函数来使用RGB/RGBA颜色。

每个geom都有自己的属性(称为参数)，相同的参数可能导致不同的变化，这取决于你使用的geom。

```{r}
g + geom_point(color = "firebrick", shape = "diamond", size = 2) +
    geom_line(color = "firebrick", linetype = "dotted", size = .3)
```

![](https://pic1.zhimg.com/v2-b399539b77d15b2f174119644f0fccea_1440w.jpg)

**替换默认的ggplot2主题**

为了进一步说明ggplot的多用途性，让我们通过设置一个不同的内置主题(例如theme_bw())来摆脱灰色的默认ggplot2外观——通过调用theme_set()。

```{r}
theme_set(theme_bw())

g + geom_point(color = "firebrick")
```

![](https://picx.zhimg.com/v2-8bc10b8960025d21bc57fafbc82f4643_1440w.jpg)

我们还将使用theme()函数来定制主题的特定元素。你还可以找到更多关于如何使用内置主题和如何自定义主题的信息。

## 调整坐标轴

改变坐标轴的title

让我们给坐标轴加上一些很好的标签。为此我们添加了labs()，为我们想要更改的每个标签提供一个字符串(这里是x和y)。你也可以通过xlab()和ylab() 来改变坐标轴title:

```{r}
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)")

#or
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  xlab("Year") +
  ylab("Temperature (°F)")
```

![](https://pic1.zhimg.com/v2-2af11540099008134882d927a52927f0_1440w.jpg)

通常你也可以通过添加符号本身来指定符号(这里是“°”)，但下面的代码不仅允许添加符号，还可以添加上标:

```{r}
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = expression(paste("Temperature (", degree ~ F, ")"^"(Hey, why should we use metric units?!)")))
```

![](https://pic4.zhimg.com/v2-4f03c84dfda4914d2815d37aa00de399_1440w.jpg)

### 增加轴和轴标题之间的空间

Theme()是修改特定主题元素(文本、标题、框、符号、背景等)的必要命令。我们将会经常用到它们! 现在我们将修改文本元素。我们可以通过在theme()调用中重写默认的element_text()来改变所有或特定文本元素的属性(这里是axis标题):

```{r}
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.title.x = element_text(vjust = 0, size = 15),
        axis.title.y = element_text(vjust = 2, size = 15))
```

![](https://pic2.zhimg.com/v2-f602e247c32298f8976e0c28b0ee56c9_1440w.jpg)

vjust指的是垂直对齐，它的范围通常在0和1之间，但你也可以指定该范围之外的值。注意，即使我们水平移动y轴上的轴标题，我们也需要指定vjust(从标签的角度来看，这是正确的)。你也可以通过指定两个文本元素的边距来改变距离:

```{r}
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.title.x = element_text(margin = margin(t = 10), size = 15),
        axis.title.y = element_text(margin = margin(r = 10), size = 15))
```

![](https://picx.zhimg.com/v2-77a1581e43e5b119cf1ff4e662e00725_1440w.jpg)

margin()对象中的标签t和r分别指代top和right。你还可以将这四个边距指定为margin(t, r, b, l)。请注意，我们现在必须更改右边边距来修改y轴上的空间，而不是底部边距。

### 改变轴标题的美学

同样，我们使用theme()函数并修改元素axis.title.x和axis.title.y。例如，在element_text()中，我们可以覆盖大小、颜色和外观的默认值。

```{r}
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.title = element_text(size = 15, color = "firebrick",
                                  face = "italic"))
```

![](https://pica.zhimg.com/v2-7956deb34460d1d4da7c37f1807502d8_1440w.jpg)

face参数可用于使字体加粗或倾斜。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.title.x = element_text(color = "sienna", size = 15),
        axis.title.y = element_text(color = "orangered", size = 15))
```

![](https://pic1.zhimg.com/v2-0c6322ac4ae94a402f27ae2bc467acdc_1440w.jpg)

### 调整坐标轴文本美学

类似地，还可以使用axis更改坐标轴文本(这里是数字)的外观。通过文本和/或附属元素axis.text.x和axis.text.y:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.text = element_text(color = "dodgerblue", size = 12),
        axis.text.x = element_text(face = "italic"))
```

![](https://pica.zhimg.com/v2-702118de03ed24a5b561d0dc3c77a626_1440w.jpg)

### 旋转坐标轴文本

指定角度可以旋转任何文本元素。使用hjust和vjust你可以在水平(0 =左，1 =右)和垂直(0 =上，1 =下)调整文本的位置:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(axis.text.x = element_text(angle = 50, vjust = 1, hjust = 1, size = 12))
```

![](https://pic3.zhimg.com/v2-569dcd2b4c35dac6e905f23b519b957c_1440w.jpg)

### 删除坐标轴标题

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = NULL, y = "")
```

我们可以使用theme_blank()，但是通过labs()(或xlab())中删除标签要更简单。

![](https://pic1.zhimg.com/v2-6fcfdfa5fcfc21f780581d04d9cf8694_1440w.jpg)

### 限制坐标轴范围

有时你想要放大到更近距离地查看一些数据。你可以在不划分数据的情况下做到这一点:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  ylim(c(0, 50))
```

![](https://pic3.zhimg.com/v2-c14376b61d3ad33591b916b721baf8ec_1440w.jpg)

或者，您可以使用scale_y_continuous(limits = c(0,50))或coord_cartesian(ylim = c(0,50))。前者去除范围外的所有数据点，而后者调整可见区域，类似于ylim(c(0,50))。你可能会想:所以最后两者的结果是一样的。但并非如此，有一个重要的区别——比较以下两个图:

![](https://pic2.zhimg.com/v2-454894fffdc51e64bc11e161c139005b_1440w.jpg)

### 使图表从坐标原点开始

```
library(tidyverse)

chic_high <- dplyr::filter(chic, temp > 25, o3 > 20)

ggplot(chic_high, aes(x = temp, y = o3)) +
  geom_point(color = "darkcyan") +
  labs(x = "Temperature higher than 25°F",
       y = "Ozone higher than 20 ppb") +
  expand_limits(x = 0, y = 0)
```

![](https://pic1.zhimg.com/v2-ee06d86a9f092b522e34c97582ce3802_1440w.jpg)

### 相同比例的坐标轴

为了演示目的，让我们用一些绘制包含随机噪声的温度值与温度值的关系图。coord_equal()是一个坐标系统，其指定的比率表示y轴上的单位数与x轴上的单位数相等。默认ratio = 1，确保x轴上的一个单位与y轴上的一个单位长度相同:

```
ggplot(chic, aes(x = temp, y = temp + rnorm(nrow(chic), sd = 20))) +
  geom_point(color = "sienna") +
  labs(x = "Temperature (°F)", y = "Temperature (°F) + random noise") +
  xlim(c(0, 100)) + ylim(c(0, 150)) +
  coord_fixed()
```

![](https://pic4.zhimg.com/v2-1ffe08c59531488fdcadd3ec8db4f2ff_1440w.jpg)

高于1的比率会使y轴上的单位比x轴上的单位长，反之亦然:

```
ggplot(chic, aes(x = temp, y = temp + rnorm(nrow(chic), sd = 20))) +
  geom_point(color = "sienna") +
  labs(x = "Temperature (°F)", y = "Temperature (°F) + random noise") +
  xlim(c(0, 100)) + ylim(c(0, 150)) +
  coord_fixed(ratio = 1/5)
```

![](https://pic2.zhimg.com/v2-3248ef31336728054bd99e833b2c3835_1440w.jpg)

### 使用函数调整标签

有时稍微修改一下标签是很方便的，比如添加单位或百分号，而不在数据中直接添加这些标签。在这种情况下你可以使用一个函数:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = NULL) +
  scale_y_continuous(label = function(x) {return(paste(x, "Degrees Fahrenheit"))})
```

![](https://pic3.zhimg.com/v2-a8b296a1c56439327bcaf96beb08f99c_1440w.jpg)

## 调整标题

### 添加标题

我们可以通过ggtitle()函数添加标题:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  ggtitle("Temperatures in Chicago")
```

![](https://pic1.zhimg.com/v2-a6bb70b168580cdd0bc22bb304ae51fa_1440w.jpg)

或者，你也可以使用labs()函数。在这里你可以添加几个参数，例如副标题，标题和标签(以及如前所示的坐标轴标题)

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)",
       title = "Temperatures in Chicago",
       subtitle = "Seasonal pattern of daily temperatures from 1997 to 2001",
       caption = "Data: NMMAPS",
       tag = "Fig. 1")
```

![](https://pica.zhimg.com/v2-059ab7b77ff92e3d46465ece1bf82384_1440w.jpg)

### 加粗标题，并在基线上添加空格

同样，因为我们想要修改主题的属性，所以我们使用theme()函数，axis.title 和 axis.text来修改字体和边距。以下所有主题元素的修改不仅适用于标题plot.title，还适用于所有其他标签，如plot.subtitle, plot.caption, plot.caption, legend.title, legend.text, axis.title和axis.text。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)",
       title = "Temperatures in Chicago") +
  theme(plot.title = element_text(face = "bold",
                                  margin = margin(10, 0, 10, 0),
                                  size = 14))
```

![](https://pic1.zhimg.com/v2-e4b7292aa85f11156d2b6c8021cbb4c4_1440w.jpg)

### 调整标题位置

一般的对齐方式(左、中、右)是由hjust()控制， hjust是horizontal adjustment的缩写。当然，也可以通过vjust来调整垂直对齐。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = NULL,
       title = "Temperatures in Chicago",
       caption = "Data: NMMAPS") +
  theme(plot.title = element_text(hjust = 1, size = 16, face = "bold.italic"))
```

![](https://picx.zhimg.com/v2-3ec765728393eda4d25d5fd13d52ef85_1440w.jpg)

2019年以来，用户可以根据面板区域(默认)或通过plot.title.position和plot.caption.position指定标题、副标题和标题的对齐方式。在大多数情况下，后者实际上是更好的选择，许多人非常喜欢这个新功能，因为如果y轴标签非常长，对齐后看起来会很糟糕。

```
(g <- ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  scale_y_continuous(label = function(x) {return(paste(x, "Degrees Fahrenheit"))}) +
  labs(x = "Year", y = NULL,
       title = "Temperatures in Chicago between 1997 and 2001 in Degrees Fahrenheit",
       caption = "Data: NMMAPS") +
  theme(plot.title = element_text(size = 14, face = "bold.italic"),
        plot.caption = element_text(hjust = 0)))
```

![](https://pic1.zhimg.com/v2-ee10ba4322d8cadc6b37a0cb168fd3c8_1440w.jpg)

```
g + theme(plot.title.position = "plot",
          plot.caption.position = "plot")
```

![](https://pic1.zhimg.com/v2-051ae500bfe74bd9cc10e5f27ae4cf7a_1440w.jpg)

### 标题中使用非传统字体

你还可以使用不同的字体，不仅仅是ggplot提供的默认字体(不同的操作系统会有所不同)。有几个软件包可以帮助你使用安装在你电脑上的字体。在这里，我使用了showtext包，它可以方便地在R图中使用各种类型的字体(TrueType、OpenType、Type 1、web字体等)。在我们加载了包之后，你需要导入必须安装在你电脑上的字体。我经常使用谷歌字体，它可以用font_add_google()函数导入，但你也可以用font_add()添加其他字体。(注意，即使在使用谷歌字体的情况下，你必须安装字体并重启rstudio 以使用字体)

```
library(showtext)
font_add_google("Playfair Display", ## name of Google font
                "Playfair")  ## name that will be used in R
font_add_google("Bangers", "Bangers")
```

现在，我们可以使用这些字体家族使用-是的，你猜对了- theme():

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)",
       title = "Temperatures in Chicago",
       subtitle = "Daily temperatures in °F from 1997 to 2001") +
  theme(plot.title = element_text(family = "Bangers", hjust = .5, size = 25),
        plot.subtitle = element_text(family = "Playfair", hjust = .5, size = 15))
```

![](https://pic4.zhimg.com/v2-4cd0fd3ca61b7ad003dd0ece38a03363_1440w.jpg)

### 更改多行文本的间距

可以使用lineheight参数来更改行与行之间的间距。在这个例子中，我把线条压在一起(lineheight < 1)。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  ggtitle("Temperatures in Chicago\nfrom 1997 to 2001") +
  theme(plot.title = element_text(lineheight = .8, size = 16))
```

![](https://pic3.zhimg.com/v2-cd9e4920de9b55c4e9f619ef501b1158_1440w.jpg)

## 调整图例

我们将根据季节类别对数据进行颜色编码。或者用更通俗的说法:我们把季节的变化映射到色彩上。ggplot2的一个优点是，当将变量映射到美学时，它会默认添加一个图例。你可以看到，默认情况下，图例标题就是我们在color参数中指定的:

```
ggplot(chic,
       aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pic3.zhimg.com/v2-b5e190cee209646f88316c59e5512fc8_1440w.jpg)

### 移除图列

非常简单，使用 theme(legend.position = "none"):

```
ggplot(chic,
       aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.position = "none")
```

![](https://picx.zhimg.com/v2-b0df05ea32c98a47aa74fc597ce19bdd_1440w.jpg)

你还可以根据具体情况使用guides(color = "none")或scale_color_discrete(guide = "none")。虽然theme()的更改会一次性删除所有图例，但你可以使用后一种选项会删除特定的图例，同时保留其他图例。例如在这里，我们保留形状的图例，而放弃颜色的图例。

```
ggplot(chic,
       aes(x = date, y = temp,
           color = season, shape = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  guides(color = "none")
```

![](https://pica.zhimg.com/v2-544a9a8a9c2e22913591b9c3824861dc_1440w.jpg)

### 移除图例标题

正如你猜到的，使用element_blank():

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.title = element_blank())
```

![](https://pica.zhimg.com/v2-be0b79e2f78dab7d76436aad46c598b4_1440w.jpg)

### 改变图例的位置

如果你不想把图例放在右边，就用 theme中的legend.position 参数。在theme中作为图例的位置可以是’top’, ‘bottom’, ‘left’, ‘right'。

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.position = "top")
```

![](https://pic2.zhimg.com/v2-4a06e3a1ee0234778d443a0ca737facb_1440w.jpg)

你也可以在面板中指定一个相对的x和y坐标从0(左或下)到1(右或上)的向量:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)",
       color = NULL) +
  theme(legend.position = c(.15, .15),
        legend.background = element_rect(fill = "transparent"))
```

![](https://pic2.zhimg.com/v2-98ce8203020756091b7e037738642ed7_1440w.jpg)

### 改变图例的方向

图例的方向默认是垂直的，但当你选择“top”或“bottom”位置时，是水平的。但你也可以随心所欲地改变方向:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.position = c(.5, .97),
        legend.background = element_rect(fill = "transparent")) +
  guides(color = guide_legend(direction = "horizontal"))
```

![](https://pic3.zhimg.com/v2-bb245606076c1b5bf601ca4071a6d54a_1440w.jpg)

### 改变图例的风格

你可以通过调整theme中的legend.title来改变图例标题的外观:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.title = element_text(family = "Playfair",
                                    color = "chocolate",
                                    size = 14, face = "bold"))
```

![](https://picx.zhimg.com/v2-89e7951c849d1d240fc53d74e13c5a9b_1440w.jpg)

### 改变图例的标题

改变图例标题的最简单方法是使用labs()层:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)",
       color = "Seasons\nindicated\nby colors:") +
  theme(legend.title = element_text(family = "Playfair",
                                    color = "chocolate",
                                    size = 14, face = "bold"))
```

![](https://pica.zhimg.com/v2-1209c752509692a2ecd9ef1c8bc5c7d6_1440w.jpg)

### 改变图例键值的顺序

我们可以通过改变season的不同level来实现:

```
chic$season <-
  factor(chic$season,
         levels = c("Winter", "Spring", "Summer", "Autumn"))

ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pic3.zhimg.com/v2-e15776298c4f8ff56539dc1026dc8cde_1440w.jpg)

### 改变图例的标签

在scale_color_discrete()中提供一个名称向量，用月份来替换季节:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  scale_color_discrete(
    name = "Seasons:",
    labels = c("Mar—May", "Jun—Aug", "Sep—Nov", "Dec—Feb")
  ) +
  theme(legend.title = element_text(
    family = "Playfair", color = "chocolate", size = 14, face = 2
  ))
```

![](https://pic2.zhimg.com/v2-04b0eac89213823d8872544f1edd0423_1440w.jpg)

### 更改图例中的背景

为了改变图例键值的背景色(填充)，我们调整theme中legend.key的设置:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.key = element_rect(fill = "darkgoldenrod1"),
        legend.title = element_text(family = "Playfair",
                                    color = "chocolate",
                                    size = 14, face = 2)) +
  scale_color_discrete("Seasons:")
```

![](https://pica.zhimg.com/v2-60f40533de5f1141acbe0ece4dc99d36_1440w.jpg)

如果你想完全去掉它们，可以使用fill = NA或fill = "transparent"。

### 改变图例符号的大小

图例中的点在默认大小下可能会丢失一些，特别是没有box的情况下。要覆盖默认图层，可以使用guides图层，如下所示:

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.key = element_rect(fill = NA),
        legend.title = element_text(color = "chocolate",
                                    size = 14, face = 2)) +
  scale_color_discrete("Seasons:") +
  guides(color = guide_legend(override.aes = list(size = 6)))
```

![](https://pica.zhimg.com/v2-175b200d2b61f37fe899eaa5e4890208_1440w.jpg)

### 手动添加图例项（legend items）

ggplot2不会自动添加图例，除非你将外观(颜色，大小等)映射到一个变量。但有时候，我想要一个图例，这样就能清楚地知道你在画什么。

这是默认值：

```
ggplot(chic, aes(x = date, y = o3)) +
  geom_line(color = "gray") +
  geom_point(color = "darkorange2") +
  labs(x = "Year", y = "Ozone")
```

![](https://pic2.zhimg.com/v2-01892dcd0bef318de571c20bea7662bf_1440w.jpg)

我们可以通过将guide映射到变量来强制生成图例。我们使用aes()映射线和点，我们不是映射到数据集中的一个变量，而是映射到一个字符串(这样我们就得到了每个颜色)。

```
ggplot(chic, aes(x = date, y = o3)) +
  geom_line(aes(color = "line")) +
  geom_point(aes(color = "points")) +
  labs(x = "Year", y = "Ozone") +
  scale_color_discrete("Type:")
```

![](https://pica.zhimg.com/v2-059990898135c33a4c911f5590798704_1440w.jpg)

我们已经很接近，但这还不是我们想要的。我们想要灰色和红色! 要更改颜色，我们使用scale_color_manual()。此外，我们使用guide()函数重写了图列中的美学。

瞧!现在，我们有一个带有灰线和橙红点的图，以及一个单独的灰线和一个单独的橙红点作为图例符号:

```
ggplot(chic, aes(x = date, y = o3)) +
  geom_line(aes(color = "line")) +
  geom_point(aes(color = "points")) +
  labs(x = "Year", y = "Ozone") +
  scale_color_manual(name = NULL,
                     guide = "legend",
                     values = c("points" = "darkorange2",
                                "line" = "gray")) +
  guides(color = guide_legend(override.aes = list(linetype = c(1, 0),
                                                  shape = c(NA, 16))))
```

![](https://pic1.zhimg.com/v2-338a43352397f504ea9dc6e6ff9063f6_1440w.jpg)

### 使用其他图例风格

就像您在前面的几个例子中看到的那样，像season这样的分类变量的默认图例是guide_legend()。如果你将一个连续变量映射到美学，ggplot2默认将不使用guide_legend()，而是guide_colorbar()(或guide_colourbar()):

```
ggplot(chic,
       aes(x = date, y = temp, color = temp)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)", color = "Temperature (°F)")
```

![](https://pica.zhimg.com/v2-2e4cf8df6053663e8d10c0bea5225918_1440w.jpg)

但是，通过使用guide_legend()，你可以强制图例显示离散的颜色，就像分类变量的情况一样:

```
ggplot(chic,
       aes(x = date, y = temp, color = temp)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)", color = "Temperature (°F)") +
  guides(color = guide_legend())
```

![](https://picx.zhimg.com/v2-87cf430d78d9b793482d51be0713ee9d_1440w.jpg)

你也可以用*binned scales：*

```
ggplot(chic,
       aes(x = date, y = temp, color = temp)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)", color = "Temperature (°F)") +
  guides(color = guide_bins())
```

![](https://picx.zhimg.com/v2-d5a4994164854915fb3f5829edea9385_1440w.jpg)

## 调整背景和网格线

有一些方法可以用一个函数来改变图表的整体外观，但是如果你只是想改变一些元素的**颜色**，你也可以这样做**。**

### 改变面板背景颜色

要改变面板区域(即绘制数据的区域)的背景颜色(填充)，需要调主题theme中的panel.background:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "#1D8565", size = 2) +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(panel.background = element_rect(
    fill = "#64D2AA", color = "#64D2AA", size = 2)
  )
```

![](https://pic1.zhimg.com/v2-849a788ddfea578810ee0132ac54d004_1440w.jpg)

### 改变网格线

有两种类型的网格线:一级网格线（major grid line）和二级网格线(minor grid line)。你可以通过覆盖面板的默认值来更改这些。对于每一组网格线，分别使用panel.grid.major和panel.grid.minor。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(panel.grid.major = element_line(color = "gray10", size = .5),
        panel.grid.minor = element_line(color = "gray70", size = .25))
```

![](https://pic1.zhimg.com/v2-0ac531a1babef75e3ae1773d99dcf024_1440w.jpg)

你甚至可以为所有的网格线指定4个不同水平的设置:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(panel.grid.major = element_line(size = .5, linetype = "dashed"),
        panel.grid.minor = element_line(size = .25, linetype = "dotted"),
        panel.grid.major.x = element_line(color = "red1"),
        panel.grid.major.y = element_line(color = "blue1"),
        panel.grid.minor.x = element_line(color = "red4"),
        panel.grid.minor.y = element_line(color = "blue4"))
```

![](https://pic3.zhimg.com/v2-3da809dc98858329f7d405373ad0533c_1440w.jpg)

当然，如果你愿意，你也可以删除一些或所有网格线:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(panel.grid.minor = element_blank())
```

![](https://pic1.zhimg.com/v2-a8328e208eb263b7be1d3cde7928ac48_1440w.jpg)

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(panel.grid = element_blank())
```

![](https://pica.zhimg.com/v2-8c3a130695998e6d6d9a272cdd7eb08a_1440w.jpg)

### 改变网格线的间距

你还可以定义一级网格线和二级网格线之间的断点:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  scale_y_continuous(breaks = seq(0, 100, 10),
                     minor_breaks = seq(0, 100, 2.5))
```

![](https://pic3.zhimg.com/v2-890e06ddf04e24ba3efe03253c49c254_1440w.jpg)

### 更改图表背景颜色

同样，要改变plot区域的背景颜色(填充)，需要修改主题元素plot.background:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(plot.background = element_rect(fill = "gray60",
                                       color = "gray30", size = 2))
```

![](https://picx.zhimg.com/v2-e83458da1bc9c127629d7ea2afc2f0f3_1440w.jpg)

# 中间部分

这部分是整个教程的中间部分，具体包括：

- 调整页边距
- 做多面板图
- 调整颜色
- 调整主题
- 调整线

## 调整边距（Margin）

有时，在图片边缘添加一点空间是有用的。与前面的例子类似，我们可以使用theme()函数的参数plot.margin。

现在我们在左边和右边都添加些额外的空间。参数plot.margin可以接受各种不同的单位(c m、inches等)。你可以为所有边提供相同的值(最简单的是通过rep(x, 4))或为每个边提供特定的距离。我在上面和下面使用1cm的边距，在右边使用3cm的边距，在左边使用8cm的边距。

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(plot.background = element_rect(fill = "gray60"),
        plot.margin = margin(t = 1, r = 3, b = 1, l = 8, unit = "cm"))
```

![](https://pica.zhimg.com/v2-22bb72c134912364c6425ae2f38b7d12_1440w.jpg)

边距的顺序是上（top）、右（right）、下（bottom）、左（left）

## 做多面板图

ggplot2包有两个很好的函数，用于创建多面板图形，称为facets。facet_wrap本质上创建了一个基于单个变量的图形带，而facet_grid则生成了包含两个变量的网格。

### 创建一个基于两个变量的多面版图：

在有两个变量的情况下，由facet_grid完成这项工作。变量的顺序决定了行数和列数。

```
ggplot(chic, aes(x = date, y = temp))+
   geom_point(color ="orangered", alpha =.3)+
   theme(axis.text.x = element_text(angle =45, vjust =1, hjust =1))+
   labs(x ="Year", y ="Temperature (°F)")+
   facet_grid(year ~ season)
```

![](https://pic3.zhimg.com/v2-a819f9c55ed7ec77bd63535accba2896_1440w.jpg)

对行和列的位置，可以将facet_grid(year ~ season)更改为facet_grid(season ~ year)

### 创建基于单个变量的多面版图

Facet_wrap创建单个变量的面版图，前面用波浪线写:Facet_wrap (~ variable)。图的呈现可由参数ncol和nrow控制。

```
g <-
  ggplot(chic, aes(x = date, y = temp)) +
    geom_point(color = "chartreuse4", alpha = .3) +
    labs(x = "Year", y = "Temperature (°F)") +
    theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))

g + facet_wrap(~ year)
```

![](https://pica.zhimg.com/v2-7829a0760d4c0998d18686e031f8a50e_1440w.jpg)

你可以按照自己的喜好来排列这些图，比如将它们排成一行。

```
g + facet_wrap(~ year, nrow = 1)
```

![](https://pic2.zhimg.com/v2-990f3a04b299ead77b842f7d0dbef9b9_1440w.jpg)

甚至调整成一个不对称的网格图：

```
g + facet_wrap(~ year, ncol = 3) + theme(axis.title.x = element_text(hjust = .15))
```

![](https://pica.zhimg.com/v2-8549d89bf506081f6a1deef6617800ec_1440w.jpg)

允许坐标轴（Axes）自由漫步：

在ggplot2中，多面板图的默认值是在每个面板中使用同样的刻度（scale）。但有时你希望允许一个面板自己的数据来决定scale。通常不这么做，因为它可能会让用户对数据产生错误的印象。但有时它确实很有用，你可以设置scales = "free":

```
g + facet_wrap(~ year, nrow = 2, scales = "free")
```

![](https://picx.zhimg.com/v2-86ae6caa4b7c3a955422c3e35a9fc59f_1440w.jpg)

注意：现在每个面板X轴和Y轴的刻度已经不一样了

facet_wrap（）也可用于2个变量的情况：

```
g + facet_wrap(year ~ season, nrow = 4, scales = "free_x")
```

![](https://pic3.zhimg.com/v2-8e74defacc9bd59f365ad944c964ea46_1440w.jpg)

当使用facet_wrap时，你仍能够控制网格设计:重新定义每行和每列的图形数量，你也可以让所有轴的刻度自由定义。相反，facet_grid也将接受一个free参数，但只会让它在每列或每行中自由定义，而不是针对每个面板:

```
g + facet_grid(year ~ season, scales ="free_x")
```

![](https://pic3.zhimg.com/v2-9bb62db0613ba833260c111a74dda3fc_1440w.jpg)

### **修改条带文本的风格**

通过使用主题，你可以修改条带文本的外观(即每个facet的标题)和条带文本框:

```
g + facet_wrap(~ year, nrow = 1, scales = "free_x") +
  theme(strip.text = element_text(face = "bold", color = "chartreuse4",
                                  hjust = 0, size = 20),
        strip.background = element_rect(fill = "chartreuse3", linetype = "dotted"))
```

![](https://pic2.zhimg.com/v2-00553513434d5040cf937ffa4596c175_1440w.jpg)

下面两个函数是从Claus Wilke ([ggtext](https://zhida.zhihu.com/search?content_id=171304087&content_type=Article&match_order=1&q=ggtext&zhida_source=entity)包的作者)的答案中改动而来的，它们允许结合使用ggtext提供的element_textbox()来突出显示特定的标签（label）。

```
library(ggtext)
library(rlang)

element_textbox_highlight <- function(..., hi.labels = NULL, hi.fill = NULL,
                                      hi.col = NULL, hi.box.col = NULL, hi.family = NULL) {
  structure(
    c(element_textbox(...),
      list(hi.labels = hi.labels, hi.fill = hi.fill, hi.col = hi.col, hi.box.col = hi.box.col, hi.family = hi.family)
    ),
    class = c("element_textbox_highlight", "element_textbox", "element_text", "element")
  )
}

element_grob.element_textbox_highlight <- function(element, label = "", ...) {
  if (label %in% element$hi.labels) {
    element$fill <- element$hi.fill %||% element$fill
    element$colour <- element$hi.col %||% element$colour
    element$box.colour <- element$hi.box.col %||% element$box.colour
    element$family <- element$hi.family %||% element$family
  }
  NextMethod()
}
```

现在你可以使用它修改所有的条带文本:

```
g + facet_wrap(year ~ season, nrow = 4, scales = "free_x") +
  theme(
    strip.background = element_blank(),
    strip.text = element_textbox_highlight(
      family = "Playfair", size = 12, face = "bold",
      fill = "white", box.color = "chartreuse4", color = "chartreuse4",
      halign = .5, linetype = 1, r = unit(5, "pt"), width = unit(1, "npc"),
      padding = margin(5, 0, 3, 0), margin = margin(0, 1, 3, 1),
      hi.labels = c("1997", "1998", "1999", "2000"),
      hi.fill = "chartreuse4", hi.box.col = "black", hi.col = "white"
    )
  )
```

![](https://pic2.zhimg.com/v2-562f085e0672e9eb3148553ddedbe369_1440w.jpg)

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(aes(color = season == "Summer"), alpha = .3) +
  labs(x = "Year", y = "Temperature (°F)") +
  facet_wrap(~ season, nrow = 1) +
  scale_color_manual(values = c("gray40", "firebrick"), guide = "none") +
  theme(
    axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1),
    strip.background = element_blank(),
    strip.text = element_textbox_highlight(
      size = 12, face = "bold",
      fill = "white", box.color = "white", color = "gray40",
      halign = .5, linetype = 1, r = unit(0, "pt"), width = unit(1, "npc"),
      padding = margin(2, 0, 1, 0), margin = margin(0, 1, 3, 1),
      hi.labels = "Summer", hi.family = "Bangers",
      hi.fill = "firebrick", hi.box.col = "firebrick", hi.col = "white"
    )
  )
```

![](https://picx.zhimg.com/v2-d43bc8e317e46a45068e3bb8acce7b4b_1440w.jpg)

### **创建一个组合图：**

有几种组合图的方法。在我看来，最简单的方法是Thomas Lin Pedersen的[patchwork](https://zhida.zhihu.com/search?content_id=171304087&content_type=Article&match_order=1&q=patchwork&zhida_source=entity)包

```
p1 <- ggplot(chic, aes(x = date, y = temp,
                       color = season)) +
        geom_point() +
        geom_rug() +
        labs(x = "Year", y = "Temperature (°F)")

p2 <- ggplot(chic, aes(x = date, y = o3)) +
        geom_line(color = "gray") +
        geom_point(color = "darkorange2") +
        labs(x = "Year", y = "Ozone")

library(patchwork)
p1 + p2
```

![](https://pic3.zhimg.com/v2-c73a494e88886e32ad55fae1cc675680_1440w.jpg)

我们可以通过“/”来改变另个图形的排列：

![](https://pic3.zhimg.com/v2-40c0fbf7c03f8fa0c9f8583f4ce8bbe0_1440w.jpg)

而且嵌套图也是可以的：

![](https://picx.zhimg.com/v2-3f472746182e3f3749a16190766aed49_1440w.jpg)

请注意图形的排列，即使只有一个图形包含图例

或者，Claus Wilke的[cowplot](https://zhida.zhihu.com/search?content_id=171304087&content_type=Article&match_order=1&q=cowplot&zhida_source=entity)包也提供了组合多个图形的功能:

```
library(cowplot)
plot_grid(plot_grid(g, p1), p2, ncol = 1)
```

![](https://picx.zhimg.com/v2-9965158edac6845b43870d822320c539_1440w.jpg)

..{[gridExtra](https://zhida.zhihu.com/search?content_id=171304087&content_type=Article&match_order=1&q=gridExtra&zhida_source=entity)}包也一样:

```
library(gridExtra)
grid.arrange(g, p1, p2,
             layout_matrix = rbind(c(1, 2), c(3, 3)))
```

![](https://pic3.zhimg.com/v2-b00cf75afdd29670089628bdaacce8ee_1440w.jpg)

{patchwork}中也有相同的布局思想，它允许创建复杂的组合:

```
layout <- "
AABBBB#
AACCDDE
##CCDD#
##CC###
"

p2 + p1 + p1 + g + p2 +
  plot_layout(design = layout)
```

![](https://picx.zhimg.com/v2-944792a5bd6be690d461a78974f2c333_1440w.jpg)

## **调整颜色**

在ggplot2中使用颜色是很简单的。如果你想了解更高级的内容，可以去看看[Hadley](https://link.zhihu.com/?target=http%3A//www.springer.com/de/book/9780387981413%23otherversion%3D9780387981406)的书，里面有很好的内容。其他好的资料来源有R Cookbook和Yan Holtz的R Graph Gallery中的“颜色部分”。

当涉及到{ggplot2}的颜色时，有两个主要的区别。参数color和fill都可以：

1、指定为单色

2、赋值给变量

正如您在本教程的开头所看到的，aes内部的变量是由变量编码的，而那些外部的变量是与变量无关的属性。下面这张图表做了很好的展示:

```
ggplot(chic, aes(year)) +
  geom_bar(aes(fill = season), color = "grey", size = 2) +
  labs(x = "Year", y = "Observations", fill = "Season:")
```

![](https://picx.zhimg.com/v2-7bbb51ba8eccb0668c33439122e06c8f_1440w.jpg)

### 指定单个颜色

静态、单一的颜色使用起啦很简单。我们可以为geom指定一个单一的颜色:

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "steelblue", size = 2) +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pic2.zhimg.com/v2-92a5baa892fd96216972be60d37417e5_1440w.jpg)

如果同时提供了color(轮廓色)和fill(填充色):

```
ggplot(chic, aes(x = date, y = temp)) +
  geom_point(shape = 21, size = 2, stroke = 1,
             color = "#3cc08f", fill = "#c08f3c") +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pica.zhimg.com/v2-9a37001377545ca9e72d22813ef775ae_1440w.jpg)

哥伦比亚大学的Tian Zheng创建了一个有用的R色[PDF of R colors](https://link.zhihu.com/?target=http%3A//www.stat.columbia.edu/~tzheng/files/Rcolor.pdf)。当然，你也可以指定hex颜色代码、RGB或RGBA值(通过RGB()函数)：

### 将颜色赋值给变量

在ggplot2中，分配给变量的颜色通过scale_color\_\*和scale_fill\_\*函数来修改。为了在数据中使用颜色，最重要的是你需要知道你是在处理一个分类变量还是一个连续变量。调色板的选择应取决于变量的类型，连续变量使用顺序调色板或发散调色板，分类变量使用定性调色板:

![](https://pica.zhimg.com/v2-787756a75760dbbbfa026ab8ae3d6d56_1440w.jpg)

分类变量

分类变量是可以分为组(类别)的数据类型。变量可以进一步指定为nominal变量、ordinal变量和binary变量(二分类变量)。定性/分类变量的例子有:

![](https://pic1.zhimg.com/v2-2a6908769307b8daf918f66c0c5c8bb6_1440w.jpg)

默认的分类调色板是这样的:

```
(ga <- ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)", color = NULL))
```

![](https://pic2.zhimg.com/v2-279759cb1ac32eda49a6ca10cfc8d829_1440w.jpg)

你可以选择一组颜色，并通过函数scale\_\*\_manual()将它们分配给一个分类变量(\*可以是color, colour，或fill)。指定颜色的数量必须与类别的数量相匹配:

```
ga + scale_color_manual(values = c("dodgerblue4",
                                   "darkolivegreen4",
                                   "darkorchid3",
                                   "goldenrod1"))
```

![](https://pic4.zhimg.com/v2-6521a37b925b1d1a1ffff3db99d9f7cb_1440w.jpg)

[ColorBrewer](https://link.zhihu.com/?target=http%3A//colorbrewer2.org/)调色板是一个为地图选择配色方案的在线工具。不同的颜色组合被设计成三到十二种外观相似的配色方案。这些调色板作为ggplot2包中的内置函数可用，可以通过调用scale\_\*\_brewer()来应用:

```
ga + scale_color_brewer(palette = "Set1")
```

![](https://pica.zhimg.com/v2-a03b18faad7247719ad2773b46a5deec_1440w.jpg)

你可以通过RColorBrewer::display.brewer.all()来探索所有可用的方案

有许多扩展包可以提供额外的调色板。对于R中可用的调色板的广泛概述，请查看[Emil Hvitfeldt](https://link.zhihu.com/?target=https%3A//github.com/EmilHvitfeldt/r-color-palettes/blob/master/README.md%23comprehensive-list-of-color-palettes-in-r)提供的集合。你也可以使用他的{paletteer}包，这是R中一个全面的调色板集合，使用一致的语法。

例如，{ggthemes}包允许R用户访问Tableau颜色。Tableau是一个著名的可视化软件，具有知名的调色板。

```
library(ggthemes)
ga + scale_color_tableau()
```

![](https://pica.zhimg.com/v2-69080c5ddf601fd6a6ae342a55192afa_1440w.jpg)

ggsci包提供科学杂志和科幻主题的调色板。想要一个看起来像发表在《科学》或《自然》上的颜色的图表吗?在这里!

```
library(ggsci)
g1 <- ga + scale_color_aaas()
g2 <- ga + scale_color_npg()

library(patchwork)
(g1 + g2) * theme(legend.position = "top")
```

![](https://pica.zhimg.com/v2-cb4de6d7de9f7e56c47854ab32b0ae76_1440w.jpg)

连续变量

连续变量代表一个可测量的量，因此是数值的。定量数据可以进一步分类为连续(可能是浮点数)或离散(仅整数):

![](https://pic2.zhimg.com/v2-0df49d49d26f3ab94041614534363d75_1440w.jpg)

在我们的数据集例子中，我们想要着色的变量为ozone，这是一个与温度密切相关的连续变量(更高的温度=更高的臭氧)。函数scale\_\*\_gradient()是一个顺序梯度，而scale\_\*\_gradient2()是发散的。

```
gb <- ggplot(chic, aes(x = date, y = temp, color = temp)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)", color = "Temperature (°F):")

gb + scale_color_continuous()
```

![](https://pica.zhimg.com/v2-36b83cf89d00fe137baf95597b6c655c_1440w.jpg)

这是发散的默认配色方案:

```
mid <- mean(chic$temp)  ## midpoint

gb + scale_color_gradient2(midpoint = mid)
```

![](https://pic3.zhimg.com/v2-8e526e4ad19a8b34d33564175bbc97be_1440w.jpg)

### 修改调色板

自从ggplot2 3.0.0的最新版本发布以来，我们可以在图层被映射到数据之后修改图层外观。那么为什么一开始不使用修改过的颜色呢?由于{ggplot2}只能处理一种color和一种fill的刻度。仔细看看下面的例子，我们在ggdark包中使用了invert_color():

```
library(ggdark)

ggplot(chic, aes(date, temp, color = temp)) +
  geom_point(size = 5) +
  geom_point(aes(color = temp,
                 color = after_scale(invert_color(color))),
             size = 2) +
  scale_color_scico(palette = "hawaii", guide = "none") +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pic2.zhimg.com/v2-e22a766c1c03482d411f2b303acbf545_1440w.jpg)

使用ggdark和colorspace包中的函数，即invert_color()， lighter ()， dark()和desature()，更改颜色方案是特别有趣的。你甚至可以组合这些函数。在这里，我们绘制了一个既有参数，颜色和填充的框线图:

```
library(colorspace)

ggplot(chic, aes(date, temp)) +
  geom_boxplot(aes(color = season,
                   fill = after_scale(desaturate(lighten(color, .6), .6))),
               size = 1) +
  scale_color_brewer(palette = "Dark2", guide = "none") +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://picx.zhimg.com/v2-602134ac8bc2c0f0a7bf295252b05273_1440w.jpg)

注意，你需要在对应的geom\_\*()或stat\_\*()中的aes()中指定color和/或fill，以使after_scale()工作。

## 调整主题

### 改变整体的作图风格

你可以通过使用主题来改变整个图的外观。ggplot2有八个内置主题:

![](https://picx.zhimg.com/v2-f45046783ebf271f6f5c9080fb590ad3_1440w.jpg)

有几个包提供了额外的主题，有些甚至有不同的默认调色板。例如，Jeffrey Arnold将ggthemes包和几个定制主题放在一起。无需编写任何代码，您就可以调整几种风格，其中一些以其风格和美学而闻名。

下面是一个使用theme_economist()和scale_color_economist()复制《经济学人》杂志中的绘图风格的例子:

```
library(ggthemes)

ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  ggtitle("Ups and Downs of Chicago's Daily Temperatures") +
  theme_economist() +
  scale_color_economist(name = NULL)
```

![](https://pic1.zhimg.com/v2-36c2db966b79f28acab132ebc23298b6_1440w.jpg)

另一个例子是Tufte的情节风格，一个基于Edward Tufte的书《定量信息的视觉展示》的最小墨水主题：

```
library(dplyr)
chic_2000 <- filter(chic, year == 2000)

ggplot(chic_2000, aes(x = temp, y = o3)) +
  geom_point() +
  labs(x = "Temperature (°F)", y = "Ozone") +
  ggtitle("Temperature and Ozone Levels During the Year 2000 in Chicago") +
  theme_tufte()
```

![](https://pic3.zhimg.com/v2-4505b165c0946f7611f02ac170ebacbc_1440w.jpg)

另一个带有现代主题和非默认字体预设的包是Bob Rudis的hrbrthemes包，它有几个浅色和黑色的主题:

```
library(hrbrthemes)

ggplot(chic, aes(x = temp, y = o3)) +
  geom_point(aes(color = dewpoint), show.legend = FALSE) +
  labs(x = "Temperature (°F)", y = "Ozone") +
  ggtitle("Temperature and Ozone Levels in Chicago")
```

![](https://pic1.zhimg.com/v2-03d5ab301063d38bc7cf80f393216ef6_1440w.jpg)

### 改变所有文本元素的字体

一次性改变所有文本元素的设置非常容易。所有的主题都有一个名为base_family的参数:

```
g <- ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "firebrick") +
  labs(x = "Year", y = "Temperature (°F)",
       title = "Temperatures in Chicago")

g + theme_bw(base_family = "Playfair")
```

![](https://pic1.zhimg.com/v2-18ed528c123833734fda09bcc1c5dc84_1440w.jpg)

### 改变所有文本元素的大小

theme\_\*()函数还附带了其他几个base\_\*参数。如果你仔细看看默认的主题，你会注意到所有元素的大小都是相对于base_size的(rel())。因此，如果你想增加图的可读性，你可以简单地改变base_size:

```
g + theme_bw(base_size = 30, base_family = "Roboto Condensed")
```

![](https://pica.zhimg.com/v2-b4336a2ea79b20caeef9fd161afdccd8_1440w.jpg)

### 改变所有直线和矩形元素的大小

类似地，你可以改变line和rect类型的所有元素的大小:

```
g + theme_bw(base_line_size = 1, base_rect_size = 1)
```

![](https://pic3.zhimg.com/v2-58f3fd25edba4955649e5d22b42b5a12_1440w.jpg)

### 创建自己的主题

如果您想要更改整个会话的主题，您可以使用theme_set(theme_bw())中的theme_set。默认值称为theme_gray(或theme_gray)。如果您想创建自己的自定义主题，可以直接从灰色主题提取代码并进行修改。注意rel()函数改变了相对于base_size的大小：

```
## function (base_size = 11, base_family = "", base_line_size = base_size/22,
##     base_rect_size = base_size/22)
## {
##     half_line <- base_size/2
##     t <- theme(line = element_line(colour = "black", size = base_line_size,
##         linetype = 1, lineend = "butt"), rect = element_rect(fill = "white",
##         colour = "black", size = base_rect_size, linetype = 1),
##         text = element_text(family = base_family, face = "plain",
##             colour = "black", size = base_size, lineheight = 0.9,
##             hjust = 0.5, vjust = 0.5, angle = 0, margin = margin(),
##             debug = FALSE), axis.line = element_blank(), axis.line.x = NULL,
##         axis.line.y = NULL, axis.text = element_text(size = rel(0.8),
##             colour = "grey30"), axis.text.x = element_text(margin = margin(t = 0.8 *
##             half_line/2), vjust = 1), axis.text.x.top = element_text(margin = margin(b = 0.8 *
##             half_line/2), vjust = 0), axis.text.y = element_text(margin = margin(r = 0.8 *
##             half_line/2), hjust = 1), axis.text.y.right = element_text(margin = margin(l = 0.8 *
##             half_line/2), hjust = 0), axis.ticks = element_line(colour = "grey20"),
##         axis.ticks.length = unit(half_line/2, "pt"), axis.ticks.length.x = NULL,
##         axis.ticks.length.x.top = NULL, axis.ticks.length.x.bottom = NULL,
##         axis.ticks.length.y = NULL, axis.ticks.length.y.left = NULL,
##         axis.ticks.length.y.right = NULL, axis.title.x = element_text(margin = margin(t = half_line/2),
##             vjust = 1), axis.title.x.top = element_text(margin = margin(b = half_line/2),
##             vjust = 0), axis.title.y = element_text(angle = 90,
##             margin = margin(r = half_line/2), vjust = 1), axis.title.y.right = element_text(angle = -90,
##             margin = margin(l = half_line/2), vjust = 0), legend.background = element_rect(colour = NA),
##         legend.spacing = unit(2 * half_line, "pt"), legend.spacing.x = NULL,
##         legend.spacing.y = NULL, legend.margin = margin(half_line,
##             half_line, half_line, half_line), legend.key = element_rect(fill = "grey95",
##             colour = NA), legend.key.size = unit(1.2, "lines"),
##         legend.key.height = NULL, legend.key.width = NULL, legend.text = element_text(size = rel(0.8)),
##         legend.text.align = NULL, legend.title = element_text(hjust = 0),
##         legend.title.align = NULL, legend.position = "right",
##         legend.direction = NULL, legend.justification = "center",
##         legend.box = NULL, legend.box.margin = margin(0, 0, 0,
##             0, "cm"), legend.box.background = element_blank(),
##         legend.box.spacing = unit(2 * half_line, "pt"), panel.background = element_rect(fill = "grey92",
##             colour = NA), panel.border = element_blank(), panel.grid = element_line(colour = "white"),
##         panel.grid.minor = element_line(size = rel(0.5)), panel.spacing = unit(half_line,
##             "pt"), panel.spacing.x = NULL, panel.spacing.y = NULL,
##         panel.ontop = FALSE, strip.background = element_rect(fill = "grey85",
##             colour = NA), strip.text = element_text(colour = "grey10",
##             size = rel(0.8), margin = margin(0.8 * half_line,
##                 0.8 * half_line, 0.8 * half_line, 0.8 * half_line)),
##         strip.text.x = NULL, strip.text.y = element_text(angle = -90),
##         strip.text.y.left = element_text(angle = 90), strip.placement = "inside",
##         strip.placement.x = NULL, strip.placement.y = NULL, strip.switch.pad.grid = unit(half_line/2,
##             "pt"), strip.switch.pad.wrap = unit(half_line/2,
##             "pt"), plot.background = element_rect(colour = "white"),
##         plot.title = element_text(size = rel(1.2), hjust = 0,
##             vjust = 1, margin = margin(b = half_line)), plot.title.position = "panel",
##         plot.subtitle = element_text(hjust = 0, vjust = 1, margin = margin(b = half_line)),
##         plot.caption = element_text(size = rel(0.8), hjust = 1,
##             vjust = 1, margin = margin(t = half_line)), plot.caption.position = "panel",
##         plot.tag = element_text(size = rel(1.2), hjust = 0.5,
##             vjust = 0.5), plot.tag.position = "topleft", plot.margin = margin(half_line,
##             half_line, half_line, half_line), complete = TRUE)
##     ggplot_global$theme_all_null %+replace% t
## }
## <bytecode: 0x00000000122d7580>
## <environment: namespace:ggplot2>
```

现在，让我们修改默认的主题函数，并看看结果:

```
theme_custom <- function (base_size = 12, base_family = "Roboto Condensed") {
  half_line <- base_size/2
  theme(
    line = element_line(color = "black", size = .5,
                        linetype = 1, lineend = "butt"),
    rect = element_rect(fill = "white", color = "black",
                        size = .5, linetype = 1),
    text = element_text(family = base_family, face = "plain",
                        color = "black", size = base_size,
                        lineheight = .9, hjust = .5, vjust = .5,
                        angle = 0, margin = margin(), debug = FALSE),
    axis.line = element_blank(),
    axis.line.x = NULL,
    axis.line.y = NULL,
    axis.text = element_text(size = base_size * 1.1, color = "gray30"),
    axis.text.x = element_text(margin = margin(t = .8 * half_line/2),
                               vjust = 1),
    axis.text.x.top = element_text(margin = margin(b = .8 * half_line/2),
                                   vjust = 0),
    axis.text.y = element_text(margin = margin(r = .8 * half_line/2),
                               hjust = 1),
    axis.text.y.right = element_text(margin = margin(l = .8 * half_line/2),
                                     hjust = 0),
    axis.ticks = element_line(color = "gray30", size = .7),
    axis.ticks.length = unit(half_line / 1.5, "pt"),
    axis.ticks.length.x = NULL,
    axis.ticks.length.x.top = NULL,
    axis.ticks.length.x.bottom = NULL,
    axis.ticks.length.y = NULL,
    axis.ticks.length.y.left = NULL,
    axis.ticks.length.y.right = NULL,
    axis.title.x = element_text(margin = margin(t = half_line),
                                vjust = 1, size = base_size * 1.3,
                                face = "bold"),
    axis.title.x.top = element_text(margin = margin(b = half_line),
                                    vjust = 0),
    axis.title.y = element_text(angle = 90, vjust = 1,
                                margin = margin(r = half_line),
                                size = base_size * 1.3, face = "bold"),
    axis.title.y.right = element_text(angle = -90, vjust = 0,
                                      margin = margin(l = half_line)),
    legend.background = element_rect(color = NA),
    legend.spacing = unit(.4, "cm"),
    legend.spacing.x = NULL,
    legend.spacing.y = NULL,
    legend.margin = margin(.2, .2, .2, .2, "cm"),
    legend.key = element_rect(fill = "gray95", color = "white"),
    legend.key.size = unit(1.2, "lines"),
    legend.key.height = NULL,
    legend.key.width = NULL,
    legend.text = element_text(size = rel(.8)),
    legend.text.align = NULL,
    legend.title = element_text(hjust = 0),
    legend.title.align = NULL,
    legend.position = "right",
    legend.direction = NULL,
    legend.justification = "center",
    legend.box = NULL,
    legend.box.margin = margin(0, 0, 0, 0, "cm"),
    legend.box.background = element_blank(),
    legend.box.spacing = unit(.4, "cm"),
    panel.background = element_rect(fill = "white", color = NA),
    panel.border = element_rect(color = "gray30",
                                fill = NA, size = .7),
    panel.grid.major = element_line(color = "gray90", size = 1),
    panel.grid.minor = element_line(color = "gray90", size = .5,
                                    linetype = "dashed"),
    panel.spacing = unit(base_size, "pt"),
    panel.spacing.x = NULL,
    panel.spacing.y = NULL,
    panel.ontop = FALSE,
    strip.background = element_rect(fill = "white", color = "gray30"),
    strip.text = element_text(color = "black", size = base_size),
    strip.text.x = element_text(margin = margin(t = half_line,
                                                b = half_line)),
    strip.text.y = element_text(angle = -90,
                                margin = margin(l = half_line,
                                                r = half_line)),
    strip.text.y.left = element_text(angle = 90),
    strip.placement = "inside",
    strip.placement.x = NULL,
    strip.placement.y = NULL,
    strip.switch.pad.grid = unit(0.1, "cm"),
    strip.switch.pad.wrap = unit(0.1, "cm"),
    plot.background = element_rect(color = NA),
    plot.title = element_text(size = base_size * 1.8, hjust = .5,
                              vjust = 1, face = "bold",
                              margin = margin(b = half_line * 1.2)),
    plot.title.position = "panel",
    plot.subtitle = element_text(size = base_size * 1.3,
                                 hjust = .5, vjust = 1,
                                 margin = margin(b = half_line * .9)),
    plot.caption = element_text(size = rel(0.9), hjust = 1, vjust = 1,
                                margin = margin(t = half_line * .9)),
    plot.caption.position = "panel",
    plot.tag = element_text(size = rel(1.2), hjust = .5, vjust = .5),
    plot.tag.position = "topleft",
    plot.margin = margin(base_size, base_size, base_size, base_size),
    complete = TRUE
  )
}
```

看修改后的美学与它的面板和网格线的新外观，以及轴刻度，文本和标题:

```
heme_set(theme_custom())

ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() + labs(x = "Year", y = "Temperature (°F)") + guides(color = FALSE)
```

![](https://pica.zhimg.com/v2-ca05d91dfd4a12613794ba03effe9d88_1440w.jpg)

强烈推荐这种改变图表设计的方式！它允许你通过更改一次来快速更改图表中的任何元素。你可以在几秒钟内将所有的结果以一种一致的风格绘制出来，并根据其他需要进行调整(例如，一个更大字体的演示或期刊要求)。

### 更新当前主题

你也可以使用theme_update()设置快速更改:

```
theme_custom <- theme_update(panel.background = element_rect(fill = "gray60"))

ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point() + labs(x = "Year", y = "Temperature (°F)") + guides(color = FALSE)
```

![](https://pica.zhimg.com/v2-8c2a820b8baddbf22444c4e686425072_1440w.jpg)

## 调整线

### 在图上添加水平或垂直线

你可能想要突出一个给定的范围或阈值，这可以用geom_hline()或geom_vline()在定义的坐标上绘制一条线:

```
ggplot(chic, aes(x = date, y = temp, color = o3)) +
  geom_point() +
  geom_hline(yintercept = c(0, 73)) +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://picx.zhimg.com/v2-535c255d480e62bef065e70230703533_1440w.jpg)

```
g <- ggplot(chic, aes(x = temp, y = dewpoint)) +
  geom_point(color = "dodgerblue", alpha = .5) +
  labs(x = "Temperature (°F)", y = "Dewpoint")

g +
  geom_vline(aes(xintercept = median(temp)), size = 1.5,
             color = "firebrick", linetype = "dashed") +
  geom_hline(aes(yintercept = median(dewpoint)), size = 1.5,
             color = "firebrick", linetype = "dashed")
```

![](https://pic4.zhimg.com/v2-c2c457a526114eafe259a76ffeb64701_1440w.jpg)

如果你想添加一条斜率不为0或1的直线，则需要使用geom_abline()。这是一个例子，如果你想添加一条回归线，使用参数截距和斜率。

```
reg <- lm(dewpoint ~ temp, data = chic)

g +
  geom_abline(intercept = coefficients(reg)[1],
              slope = coefficients(reg)[2],
              color = "darkorange2", size = 1.5) +
  labs(title = paste0("y = ", round(coefficients(reg)[2], 2),
                      " * x + ", round(coefficients(reg)[1], 2)))
```

![](https://pic4.zhimg.com/v2-b039aaa206132066ad85e202308adb77_1440w.jpg)

稍后，我们将学习如何使用stat_smooth(method = "lm")命令添加线性拟合

### 在图内添加一条线

以前的方法总是涵盖了图表面板的全部范围，但有时人们只想突出显示给定的区域或使用线作为注释。在本例中，geom_linerange()可以提供帮助。

```
g +
  ## vertical line
  geom_linerange(aes(x = 50, ymin = 20, ymax = 55),
                 color = "steelblue", size = 2) +
  ## horizontal line
  geom_linerange(aes(xmin = -Inf, xmax = 25, y = 0),
                 color = "red", size = 1)
```

![](https://pic3.zhimg.com/v2-161ebd8e51702f87f0683cc6444be2b0_1440w.jpg)

或者你可以使用geom_segment()绘制斜率不为0和1的线:

```
g +
  geom_segment(aes(x = 50, xend = 75,
                   y = 20, yend = 45),
               color = "purple", size = 2)
```

![](https://picx.zhimg.com/v2-68992ed7802424a89ff1f931146e169b_1440w.jpg)

### 在图中添加曲线和箭头

geom_curve()添加曲线。直线也可以如果你想的话：

```
g +
  geom_curve(aes(x = 0, y = 60, xend = 75, yend = 0),
             size = 2, color = "tan") +
  geom_curve(aes(x = 0, y = 60, xend = 75, yend = 0),
             curvature = -0.7, angle = 45,
             color = "darkgoldenrod1", size = 1) +
  geom_curve(aes(x = 0, y = 60, xend = 75, yend = 0),
             curvature = 0, size = 1.5)
```

![](https://pica.zhimg.com/v2-64a8e56d87a30dfdd296873f5e7a240c_1440w.jpg)

同样的geom也可以用来画箭头:

```
g +
  geom_curve(aes(x = 0, y = 60, xend = 75, yend = 0),
             size = 2, color = "tan",
             arrow = arrow(length = unit(0.07, "npc"))) +
  geom_curve(aes(x = 5, y = 55, xend = 70, yend = 5),
             curvature = -0.7, angle = 45,
             color = "darkgoldenrod1", size = 1,
             arrow = arrow(length = unit(0.03, "npc"),
                           type = "closed",
                           ends = "both"))
```

![](https://pic4.zhimg.com/v2-5450792e291e2614543ef111679c9bf1_1440w.jpg)

# 最后部分

这部分是整个教程的最后部分，具体包括：

- 调整文本
- 调整坐标
- 调整图表类型
- 调整条带
- 调整平滑线
- 做交互图

## 调整文本

### 给数据加标签

有时，我们想要标记数据。为了避免文本标签的重叠和拥挤，我们只用原始数据的1%，同样代表四个季节。我们使用的是geom_label()，它有一个label的新aes（）:

```
set.seed(2020)

library(dplyr)
sample <- chic %>%
  dplyr::group_by(season) %>%
  dplyr::sample_frac(0.01)

## code without pipes:
## sample <- sample_frac(group_by(chic, season), .01)

ggplot(sample, aes(x = date, y = temp, color = season)) +
  geom_point() +
  geom_label(aes(label = season), hjust = .5, vjust = -.5) +
  labs(x = "Year", y = "Temperature (°F)") +
  xlim(as.Date(c('1997-01-01', '2000-12-31'))) +
  ylim(c(0, 90)) +
  theme(legend.position = "none")
```

![](https://pic4.zhimg.com/v2-f842eb5211e4269939e8ead883141f7f_1440w.jpg)

好吧，避免标签重叠没实现。不过别担心，我们马上就能调整!

如果你不喜欢标签周围的方框，也可以使用geom_text()：

```
ggplot(sample, aes(x = date, y = temp, color = season)) +
  geom_point() +
  geom_text(aes(label = season), fontface = "bold",
            hjust = .5, vjust = -.25) +
  labs(x = "Year", y = "Temperature (°F)") +
  xlim(as.Date(c('1997-01-01', '2000-12-31'))) +
  ylim(c(0, 90)) +
  theme(legend.position = "none")
```

![](https://pic4.zhimg.com/v2-8c73e9deea98f9aafe216a48a91d4169_1440w.jpg)

一个很酷的包是[ggrepel](https://zhida.zhihu.com/search?content_id=190569203&content_type=Article&match_order=1&q=ggrepel&zhida_source=entity)，它为ggplot2提供了geoms来防止文本重叠。我们只需将geom_text()替换为geom_text_repel()，将geom_label()替换为[geom_label_repel](https://zhida.zhihu.com/search?content_id=190569203&content_type=Article&match_order=1&q=geom_label_repel&zhida_source=entity)():

```
library(ggrepel)

ggplot(sample, aes(x = date, y = temp, color = season)) +
  geom_point() +
  geom_label_repel(aes(label = season), fontface = "bold") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.position = "none")
```

![](https://pic1.zhimg.com/v2-2d63fc5829d29f8b62957fd1fecff2dc_1440w.jpg)

白色填充框可能看起来更好，所以我们将season映射到fill而不是color，并设置一个白色的填充文本:

```
ggplot(sample, aes(x = date, y = temp)) +
  geom_point(data = chic, size = .5) +
  geom_point(aes(color = season), size = 1.5) +
  geom_label_repel(aes(label = season, fill = season),
                   color = "white", fontface = "bold",
                   segment.color = "grey30") +
  labs(x = "Year", y = "Temperature (°F)") +
  theme(legend.position = "none")
```

![](https://pic3.zhimg.com/v2-61a34a8944451bf72d6a3f8c85685100_1440w.jpg)

想要纯文本标签，可以使用geom_text_repel()

### 添加文本注释

ggplot有几种添加文本注释的方法。我们将再次使用geom_text()或geom_label():

```
g <-
  ggplot(chic, aes(x = temp, y = dewpoint)) +
  geom_point(alpha = .5) +
  labs(x = "Temperature (°F)", y = "Dewpoint")

g +
  geom_text(aes(x = 25, y = 60,
                stat = "unique",
                label = "This is a useful annotation"))
```

![](https://pica.zhimg.com/v2-e1be9b55f626598fb291400790cb1b44_1440w.jpg)

顺便说一下，当然可以改变显示文本的属性:

```
g +
  geom_text(aes(x = 25, y = 60,
                label = "This is a useful annotation"),
            stat = "unique", family = "Bangers",
            size = 7, color = "darkcyan")
```

![](https://pic3.zhimg.com/v2-62f50d7d55d5bbc8ccad2c1f0bb46ef2_1440w.jpg)

如果你打算用facet函数来可视化数据，可能会遇到麻烦。比如，你可能只希望注释一次:

```
ann <- data.frame(
  o3 = 30,
  temp = 20,
  season = factor("Summer", levels = levels(chic$season)),
  label = "Here is enough space\nfor some annotations."
)

g <-
  ggplot(chic, aes(x = o3, y = temp)) +
  geom_point() +
  labs(x = "Ozone", y = "Temperature (°F)")

g +
  geom_text(data = ann, aes(label = label),
            size = 7, fontface = "bold",
            family = "Roboto Condensed") +
  facet_wrap(~season)
```

![](https://pic1.zhimg.com/v2-8ee0f2c3f9ac638780c9b5583b0665d0_1440w.jpg)

另一个挑战是多个具有不同刻度的面板图，这可能会切割你的文本:

```
g +
  geom_text(aes(x = 23, y = 97,
                label = "This is not a useful annotation"),
            size = 5, fontface = "bold") +
  scale_y_continuous(limits = c(NA, 100)) +
  facet_wrap(~season, scales = "free_x")
```

![](https://pica.zhimg.com/v2-145f0f56018054bce04de7cb3daa5cb8_1440w.jpg)

一种解决方法是事先计算坐标轴的中点，这里是x轴的中点:

```
library(tidyverse)
(ann <-
  chic %>%
  group_by(season) %>%
  summarize(o3 = min(o3, na.rm = TRUE) +
              (max(o3, na.rm = TRUE) - min(o3, na.rm = TRUE)) / 2))
```

…并使用聚合的数据来指定注释的位置:

```
g +
  geom_text(data = ann,
            aes(x = o3, y = 97,
                label = "This is a useful annotation"),
            size = 5, fontface = "bold") +
  scale_y_continuous(limits = c(NA, 100)) +
  facet_wrap(~season, scales = "free_x")
```

![](https://pic1.zhimg.com/v2-5bd452b324991fbe22992f52bb67fdac_1440w.jpg)

然而，有一种更简单的方法(就修复坐标而言)——但记住代码也需要一段时间。grid包结合ggplot2的annotation_custom()允许你根据缩放的坐标指定位置，其中0为low，1为high。grobTree()创建网格图形对象，textGrob创建文本图形对象。当你有多个不同刻度的图时，这种方法尤其有用。

```{r}
library(grid)
my_grob <- grobTree(textGrob("This text stays in place!",
                             x = .1, y = .9, hjust = 0,
                             gp = gpar(col = "black",
                                       fontsize = 15,
                                       fontface = "bold")))

g +
  annotation_custom(my_grob) +
  facet_wrap(~season, scales = "free_x") +
  scale_y_continuous(limits = c(NA, 100))
```

![](https://pic3.zhimg.com/v2-bf57c3ad433bc0f8076d495ae8539350_1440w.jpg)

### 使用Markdown和HTML渲染标注

我们再次使用了Claus Wilke的ggtext包，该包是为改进ggplot2的文本渲染而设计的。ggtext包定义了两个新的主题元素，element_markdown()和element_textbox()。该包还提供了额外的geoms。Geom_richtext()替代了geom_text()和geom_label()，并将文本渲染为markdown…

```
library(ggtext)

lab_md <- "This plot shows **temperature** in *°F* versus **ozone level** in *ppm*"

g +
  geom_richtext(aes(x = 35, y = 3, label = lab_md),
                stat = "unique")
```

![](https://pic1.zhimg.com/v2-ce784dae8abbcc8ead6525df681981fc_1440w.jpg)

…或html:

```
lab_html <- "&#9733; This plot shows <b style='color:red;'>temperature</b> in <i>°F</i> versus <b style='color:blue;'>ozone level</b>in <i>ppm</i> &#9733;"

g +
  geom_richtext(aes(x = 33, y = 3, label = lab_html),
                stat = "unique")
```

![](https://pic4.zhimg.com/v2-813dba21a09da5bfa5faadd6c816ed33_1440w.jpg)

geom提供了很多可以修改的细节，比如angle(这在默认的geom_text()和geom_label()中是不支持的)、框的属性和文本的属性。

```
g +
  geom_richtext(aes(x = 10, y = 25, label = lab_md),
                stat = "unique", angle = 30,
                color = "white", fill = "steelblue",
                label.color = NA, hjust = 0, vjust = 0,
                family = "Playfair Display")
```

![](https://pica.zhimg.com/v2-e1d45f262b7f32384ffe72efc3fbfa58_1440w.jpg)

ggtext包中的另一个geom是geom_textbox()。这个geom允许动态包装字符串，这对于较长的注释(如信息框和字幕)非常有用。

```
lab_long <- "**Lorem ipsum dolor**<br><i style='font-size:8pt;color:red;'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</i>"

g +
  geom_textbox(aes(x = 40, y = 10, label = lab_long),
               width = unit(15, "lines"), stat = "unique")
```

![](https://pic4.zhimg.com/v2-0fbc7dbcba176d4d2b0c21fa44fc27b7_1440w.jpg)

请注意，文本框既不能旋(始终水平)，也不能改变文本的对齐(始终左对齐)。

## 调整坐标

### 翻转图表

翻转图表是非常容易的， 使用coord_flip()。当使用geom 's是用来表示分类数据时，就更有意义了，例如box或如下示例所示的whiskers图:

```
ggplot(chic, aes(x = season, y = o3)) +
  geom_boxplot(fill = "indianred") +
  labs(x = "Season", y = "Ozone") +
  coord_flip()
```

![](https://pica.zhimg.com/v2-e7bdef3be9709dc4acfd717d4bd1dfc8_1440w.jpg)

### 固定坐标轴

我们可以固定坐标轴的长宽比，并固定x和y轴的呈现物理单位:

```
ggplot(chic, aes(x = temp, y = o3)) +
  geom_point() +
  labs(x = "Temperature (°F)", y = "Ozone Level") +
  scale_x_continuous(breaks = seq(0, 80, by = 20)) +
  coord_fixed(ratio = 1)
```

![](https://picx.zhimg.com/v2-5780b36055dd354e56cd1b2e4757de2b_1440w.jpg)

通过这种方式，不仅可以确保轴上的步长，还可以确保导出的图看起来与预期的一样。然而，如果没有使用合适的宽高比，保存的plot可能包含很多空白:

```
ggplot(chic, aes(x = temp, y = o3)) +
  geom_point() +
  labs(x = "Temperature (°F)", y = "Ozone Level") +
  scale_x_continuous(breaks = seq(0, 80, by = 20)) +
  coord_fixed(ratio = 1/3) +
  theme(plot.background = element_rect(fill = "grey80"))
```

![](https://pic3.zhimg.com/v2-a4c2222c14b7e144d0ae5cd2bccf84bc_1440w.jpg)

### 反转轴（180度颠倒）

你也可以分别使用scale_x_reverse()或scale_y_reverse()轻松地反转一个轴:

```
ggplot(chic, aes(x = date, y = temp, color = o3)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  scale_y_reverse()
```

![](https://pica.zhimg.com/v2-73d26c72af66dcbb5a973c828ddf733c_1440w.jpg)

注意，这只适用于连续数据。如果你想反转离散数据，使用{forcats}包中的fct_rev()函数。

### 转化轴（刻度转换）

使用scale_y_log10()或scale_y_sqrt()来转换默认的线性映射。例如，这里有一个log10转换的轴(在这种情况下引入了NA，所以要小心):

```
ggplot(chic, aes(x = date, y = temp, color = o3)) +
  geom_point() +
  labs(x = "Year", y = "Temperature (°F)") +
  scale_y_log10(lim = c(0.1, 100))
```

![](https://pic4.zhimg.com/v2-7a560f104d967e9950ae20dcdb7adfa3_1440w.jpg)

### 环化图

也可以通过调用[coord_polar](https://zhida.zhihu.com/search?content_id=190569203&content_type=Article&match_order=1&q=coord_polar&zhida_source=entity)()将坐标系统环化。

```
library(tidyverse)

chic %>%
  dplyr::group_by(season) %>%
  dplyr::summarize(o3 = median(o3)) %>%
  ggplot(aes(x = season, y = o3)) +
    geom_col(aes(fill = season), color = NA) +
    labs(x = "", y = "Median Ozone Level") +
    coord_polar() +
    guides(fill = FALSE)
```

![](https://pic2.zhimg.com/v2-166a6269444ce3bb6252988dec2cf29b_1440w.jpg)

这个坐标系统也允许绘制饼图:

```
chic_sum <-
  chic %>%
  dplyr::mutate(o3_avg = median(o3)) %>%
  dplyr::filter(o3 > o3_avg) %>%
  dplyr::mutate(n_all = n()) %>%
  dplyr::group_by(season) %>%
  dplyr::summarize(rel = n() / unique(n_all))

ggplot(chic_sum, aes(x = "", y = rel)) +
  geom_col(aes(fill = season), width = 1, color = NA) +
  labs(x = "", y = "Proportion of Days Exceeding\nthe Median Ozone Level") +
  coord_polar(theta = "y") +
  scale_fill_brewer(palette = "Set1", name = "Season:") +
  theme(axis.ticks = element_blank(),
        panel.grid = element_blank())
```

![](https://pica.zhimg.com/v2-618f8af93dc4419d8f208d97cb45b3fc_1440w.jpg)

建议查看相同代码在笛卡尔坐标系下的结果，以理解coord_polar()和theta背后的逻辑:

```
ggplot(chic_sum, aes(x = "", y = rel)) +
  geom_col(aes(fill = season), width = 1, color = NA) +
  labs(x = "", y = "Proportion of Days Exceeding\nthe Median Ozone Level") +
  #coord_polar(theta = "y") +
  scale_fill_brewer(palette = "Set1", name = "Season:") +
  theme(axis.ticks = element_blank(),
        panel.grid = element_blank())
```

![](https://pica.zhimg.com/v2-c4987d7dcd4ad7a3c08347a58098d9ee_1440w.jpg)

## 调整图表类型

### 箱形图的替代方案

箱形图很棒，但也太无聊了。而且，即使你已经习惯了看箱形图，记住，可能有很多人在看你的图时从来没有见过箱形和须状图。

有其他选择，但首先我们要画一个普通的箱形图:

```
g <-
  ggplot(chic, aes(x = season, y = o3,
                   color = season)) +
    labs(x = "Season", y = "Ozone") +
    scale_color_brewer(palette = "Dark2", guide = "none")

g + geom_boxplot()
```

![](https://pic3.zhimg.com/v2-d26e16d059241d5111c5d91543da0b50_1440w.jpg)

让我们画出原始数据的每个数据点:

![](https://pica.zhimg.com/v2-31b8059bbaa1d2e003c594a81202e3fc_1440w.jpg)

不仅无聊而且没有信息。为了改善图片，我们可以添加透明度来处理:

```
g + geom_point(alpha = .1)
```

![](https://pic2.zhimg.com/v2-40559380516bde3ed39e441d23623011_1440w.jpg)

然而，在这里设置透明度是困难的，因为要么重叠仍然太高，要么极端值是不可见的。那我们试试别的。

试着给数据添加一点抖动。我喜欢这种可视化，但使用抖动时要小心，因为这是在故意给数据添加噪音，这可能会导致对数据的误解。

```
g + geom_jitter(width = .3, alpha = .5)
```

![](https://pica.zhimg.com/v2-7f77db4fbac9ce615d8d3ab18c1a6bf4_1440w.jpg)

小提琴图是一种有用的可视化方法，它类似于箱形图，只是使用的是核密度来显示拥有最多数据的位置。

```
g + geom_violin(fill = "gray80", size = 1, alpha = .5)
```

![](https://pica.zhimg.com/v2-13391119429d0b1f6eb24176bddf807a_1440w.jpg)

我们当然可以将估算的密度和原始数据点结合起来:

```
g + geom_violin(fill = "gray80", size = 1, alpha = .5) +
    geom_jitter(alpha = .25, width = .3) +
    coord_flip()
```

![](https://pica.zhimg.com/v2-0563984d5a0b080f778e0ad9f824ed90_1440w.jpg)

{ggforce}包提供了所谓的sina函数，其中抖动的宽度是由数据的密度分布控制的，这使得抖动在视觉上更吸引人:

```
library(ggforce)

g + geom_violin(fill = "gray80", size = 1, alpha = .5) +
    geom_sina(alpha = .25) +
    coord_flip()
```

![](https://pic4.zhimg.com/v2-9d7b8d1945539ca772b1331bcac8e58d_1440w.jpg)

为了便于估计分位数，我们还可以在小提琴中添加盒子图的盒子来表示25%-quartile、中位数和75%-quartile:

```
g + geom_violin(aes(fill = season), size = 1, alpha = .5) +
    geom_boxplot(outlier.alpha = 0, coef = 0,
                 color = "gray40", width = .2) +
    scale_fill_brewer(palette = "Dark2", guide = "none") +
    coord_flip()
```

![](https://picx.zhimg.com/v2-dbbe74372255ecec7a877c20104cc041_1440w.jpg)

### 为图创建Rug

Rug代表单个数量变量的数据，显示为沿轴线的标记。在大多数情况下，它是在散点图或热图之外使用的，以可视化一个或两个变量的总体分布:

```
ggplot(chic, aes(x = date, y = temp,
                 color = season)) +
  geom_point(show.legend = FALSE) +
  geom_rug(show.legend = FALSE) +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pica.zhimg.com/v2-98e98fafab27d0310d7095ef94b552d0_1440w.jpg)

```
ggplot(chic, aes(x = date, y = temp, color = season)) +
  geom_point(show.legend = FALSE) +
  geom_rug(sides = "r", alpha = .3, show.legend = FALSE) +
  labs(x = "Year", y = "Temperature (°F)")
```

![](https://pic1.zhimg.com/v2-6a7416f2363a5808584e1a86c1909e64_1440w.jpg)

### 创建相关矩阵

有几个包可以创建相关矩阵图，有些基于{ggplot2}。下面展示如何在没有扩展包的情况下做到这一点。

第一步是创建相关矩阵。这里使用了{corrr}包，它可以很好地处理管道。我们使用Pearson，因为所有的变量都是正态分布(但如果你的变量是其他分布，可以考虑Spearman)。注意，由于相关矩阵有冗余信息，我们将其一半设置为NA。

```
library(tidyverse)

corm <-
  chic %>%
  select(death, temp, dewpoint, pm10, o3) %>%
  corrr::correlate(diagonal = 1) %>%
  corrr::shave(upper = FALSE)
```

现在，我们使用{tidyr}包中的pivot_longer()函数将生成的矩阵以长格式表示:

```
corm <- corm %>%
  pivot_longer(
    cols = -term,
    names_to = "colname",
    values_to = "corr"
  ) %>%
  mutate(rowname = fct_inorder(term),
         colname = fct_inorder(colname))
```

作图，使用geom_tile()画heatmap，使用geom_text()添加标签:

```
ggplot(corm, aes(rowname, fct_rev(colname),
                 fill = corr)) +
  geom_tile() +
  geom_text(aes(label = round(corr, 2))) +
  coord_fixed() +
  labs(x = NULL, y = NULL)
```

![](https://picx.zhimg.com/v2-603cc5edff5fde1ff9caaee00d8f1f91_1440w.jpg)

这里使用一个发散的调色板，以0相关性为中心，用白色表示缺失的数据。此外，热图周围没有网格线和填充，但有基于底层填充颜色的标签:

```
ggplot(corm, aes(rowname, fct_rev(colname),
                 fill = corr)) +
  geom_tile() +
  geom_text(aes(
    label = format(round(corr, 2), nsmall = 2),
    color = abs(corr) < .75
  )) +
  coord_fixed(expand = FALSE) +
  scale_color_manual(values = c("white", "black"),
                     guide = "none") +
  scale_fill_distiller(
    palette = "PuOr", na.value = "white",
    direction = 1, limits = c(-1, 1)
  ) +
  labs(x = NULL, y = NULL) +
  theme(panel.border = element_rect(color = NA, fill = NA),
        legend.position = c(.85, .8))
```

![](https://picx.zhimg.com/v2-d62abe1a64d50323abb72c88d86a05a7_1440w.jpg)

### 创建等高线图

等高线图可以用来对数据分段，显示观测值的密度:

```
ggplot(chic, aes(temp, o3)) +
  geom_density_2d() +
  labs(x = "Temperature (°F)", x = "Ozone Level")
```

![](https://picx.zhimg.com/v2-0bc39b621abb979b0e967024029bf91b_1440w.jpg)

```
ggplot(chic, aes(temp, o3)) +
  geom_density_2d_filled(show.legend = FALSE) +
  coord_cartesian(expand = FALSE) +
  labs(x = "Temperature (°F)", x = "Ozone Level")
```

![](https://picx.zhimg.com/v2-1da05629d7138b24ff58a8aa77e40547_1440w.jpg)

现在绘制三维数据，我们将绘制与温度和臭氧水平相关的露点阈值(即空气中的水汽将凝结成液体露珠的温度):

```
## interpolate data
library(akima)
fld <- with(chic, interp(x = temp, y = o3, z = dewpoint))

## prepare data in long format
library(reshape2)
df <- melt(fld$z, na.rm = TRUE)
names(df) <- c("x", "y", "Dewpoint")

g <- ggplot(data = df, aes(x = x, y = y, z = Dewpoint))  +
  labs(x = "Temperature (°F)", y = "Ozone Level",
       color = "Dewpoint")

g + stat_contour(aes(color = ..level.., fill = Dewpoint))
```

![](https://picx.zhimg.com/v2-41307b96c776bb07df4575feec74c025_1440w.jpg)

线条表示绘制露点的不同水平，但这不是一个漂亮的图，因为缺少边界，也很难阅读。我们尝试使用绿色调色板来编码每个臭氧水平和温度组合的露点:

```
g + geom_tile(aes(fill = Dewpoint)) +
    scale_fill_viridis_c(option = "inferno")
```

![](https://pic4.zhimg.com/v2-ad38833ddd4d045708225c8fa6074aa5_1440w.jpg)

如果我们用一个等高线图和一个瓦片图（tile）来填充等高线下面的区域，会是什么样子?

```
g + geom_tile(aes(fill = Dewpoint)) +
    stat_contour(color = "white", size = .7, bins = 5) +
    scale_fill_viridis_c()
```

![](https://pic1.zhimg.com/v2-d287534086d4ab7da13383bff0fd6f7a_1440w.jpg)

### 绘制热图

与我们的第一张等高线地图类似，我们可以通过geom_hex()很容易地显示分块到六边形网格的点的频数或密度:

```
ggplot(chic, aes(temp, o3)) +
  geom_hex() +
  scale_fill_distiller(palette = "YlOrRd", direction = 1) +
  labs(x = "Temperature (°F)", y = "Ozone Level")
```

![](https://pic4.zhimg.com/v2-c5729e97d95b69b989795ecf686c1401_1440w.jpg)

通常情况下，白线会出现在图中。你可以将颜色映射到count..(默认值)或..density.....

```
ggplot(chic, aes(temp, o3)) +
  geom_hex(aes(color = ..count..)) +
  scale_fill_distiller(palette = "YlOrRd", direction = 1) +
  scale_color_distiller(palette = "YlOrRd", direction = 1) +
  labs(x = "Temperature (°F)", y = "Ozone Level")
```

![](https://pic1.zhimg.com/v2-e9e62106534ff0cf0a06ef8cb1d3e928_1440w.jpg)

或为所有六边形单元格设置相同的边框颜色:

```
ggplot(chic, aes(temp, o3)) +
  geom_hex(color = "grey") +
  scale_fill_distiller(palette = "YlOrRd", direction = 1) +
  labs(x = "Temperature (°F)", y = "Ozone Level")
```

![](https://pic3.zhimg.com/v2-8c033a1b19493797b0c35260582ca43c_1440w.jpg)

也可以修改默认的binning，以增加或者减少六边形单元格cell的数量:

```
ggplot(chic, aes(temp, o3, fill = ..density..)) +
  geom_hex(bins = 50, color = "grey") +
  scale_fill_distiller(palette = "YlOrRd", direction = 1) +
  labs(x = "Temperature (°F)", y = "Ozone Level")
```

![](https://pic4.zhimg.com/v2-1d5e7099d6f670fb1dbf6207dee56979_1440w.jpg)

如果想要一个常规的网格，可以使用geom_bin2d()，它将数据汇总到基于bin的矩形网格单元格中:

![](https://pic4.zhimg.com/v2-70915354ae982b8d0446772cf6739b55_1440w.jpg)

### 创建岭线图（Ridge）

岭(线)图目前比较流行。虽然可以使用基本的ggplot2命令来创建，但更流行ggridge包，可以更容易创建这些图。我们将在这里使用这个包。

```
library(ggridges)
ggplot(chic, aes(x = temp, y = factor(year))) +
   geom_density_ridges(fill = "gray90") +
   labs(x = "Temperature (°F)", y = "Year")
```

![](https://pic1.zhimg.com/v2-3c1c3d627e5495da424f22451785f65e_1440w.jpg)

可以通过分别使用参数rel_min_height和scale指定重叠和尾部。此外，我们根据年份改变颜色，使其更有吸引力。

```
ggplot(chic, aes(x = temp, y = factor(year), fill = year)) +
  geom_density_ridges(alpha = .8, color = "white",
                      scale = 2.5, rel_min_height = .01) +
  labs(x = "Temperature (°F)", y = "Year") +
  guides(fill = FALSE) +
  theme_ridges()
```

![](https://pica.zhimg.com/v2-d3af170e8b7147036c9275a3c741f798_1440w.jpg)

还可以将缩放参数设置为小于1的值来消除重叠(但这在某种程度上与岭线图的想法相矛盾……)。下面是一个使用翠绿色渐变和内置主题的例子:

```
ggplot(chic, aes(x = temp, y = season, fill = ..x..)) +
  geom_density_ridges_gradient(scale = .9, gradient_lwd = .5,
                               color = "black") +
  scale_fill_viridis_c(option = "plasma", name = "") +
  labs(x = "Temperature (°F)", y = "Season") +
  theme_ridges(font_family = "Roboto Condensed", grid = FALSE)
```

![](https://pic2.zhimg.com/v2-108a2e558d9e72b99c7b117e2254fac5_1440w.jpg)

也可以对每个脊线里的几个组进行比较，并根据不同分组着色。

```
library(tidyverse)

## only plot extreme season using dplyr from the tidyverse
ggplot(data = filter(chic, season %in% c("Summer", "Winter")),
         aes(x = temp, y = year, fill = paste(year, season))) +
  geom_density_ridges(alpha = .7, rel_min_height = .01,
                      color = "white", from = -5, to = 95) +
  scale_fill_cyclical(breaks = c("1997 Summer", "1997 Winter"),
                      labels = c(`1997 Summer` = "Summer",
                                 `1997 Winter` = "Winter"),
                      values = c("tomato", "dodgerblue"),
                      name = "Season:", guide = "legend") +
  theme_ridges(grid = FALSE) +
  labs(x = "Temperature (°F)", y = "Year")
```

![](https://pic4.zhimg.com/v2-3e5af132066990491561ff6a3e0b552d_1440w.jpg)

可以在ggridge包中的geom_density_ridge()命令中，使用stat = "binline"为不同的组创建直方图:

```
ggplot(chic, aes(x = temp, y = factor(year), fill = year)) +
  geom_density_ridges(stat = "binline", bins = 25, scale = .9,
                      draw_baseline = FALSE, show.legend = FALSE) +
  theme_minimal() +
  labs(x = "Temperature (°F)", y = "Season")
```

![](https://pica.zhimg.com/v2-b5847bb88509feb195609c0b91c0de82_1440w.jpg)

## 调整条带（曲线下区域AUC, 置信区域CI等）

在这个例子中，我们将使用filter()函数创建一个30天的平均运行时间，这样我们的ribbon就不会有太多噪音。

```
chic$o3run <- as.numeric(stats::filter(chic$o3, rep(1/30, 30), sides = 2))

ggplot(chic, aes(x = date, y = o3run)) +
   geom_line(color = "chocolate", lwd = .8) +
   labs(x = "Year", y = "Ozone")
```

![](https://pic2.zhimg.com/v2-94478673d8504bdf503fea9fefa0f0d9_1440w.jpg)

如果我们使用geom_ribbon()函数填充曲线下面的区域会是什么样子?

```
ggplot(chic, aes(x = date, y = o3run)) +
   geom_ribbon(aes(ymin = 0, ymax = o3run),
               fill = "orange", alpha = .4) +
   geom_line(color = "chocolate", lwd = .8) +
   labs(x = "Year", y = "Ozone")
```

![](https://pic2.zhimg.com/v2-37b5c16efddc643aae21b2dc2db3ea1f_1440w.jpg)

很好地表示曲线下的面积(AUC)，但这不是使用geom_ribbon()的传统方式。

另外，我们还可以画一条带，在数据上下分别给出一个标准差:

```
chic$mino3 <- chic$o3run - sd(chic$o3run, na.rm = TRUE)
chic$maxo3 <- chic$o3run + sd(chic$o3run, na.rm = TRUE)

ggplot(chic, aes(x = date, y = o3run)) +
   geom_ribbon(aes(ymin = mino3, ymax = maxo3), alpha = .5,
               fill = "darkseagreen3", color = "transparent") +
   geom_line(color = "aquamarine4", lwd = .7) +
   labs(x = "Year", y = "Ozone")
```

![](https://pic1.zhimg.com/v2-a8a9b7e04dd118e25d7f74dc5a47bd80_1440w.jpg)

## 调整平滑线

使用ggplot2可以很容易地为数据添加平滑。

### 添加LOESS或GAM平滑

可以简单地使用stat_smooth()—甚至不需要公式。如果少于1000个点，就添加LOESS平滑，否则就添加一个GAM(广义加性模型，method=“GAM”)平滑。因为我们有超过1000个点，所以平滑是基于GAM的:

```
ggplot(chic, aes(x = date, y = temp)) +
  labs(x = "Year", y = "Temperature (°F)") +
  stat_smooth() +
  geom_point(color = "gray40", alpha = .5)
```

```
## `geom_smooth()` using method = 'gam' and formula 'y ~ s(x, bs = "cs")'
```

![](https://picx.zhimg.com/v2-c8f80cea6d02d7bdccdde08d99116709_1440w.jpg)

### 添加线性拟合

虽然默认值是LOESS或GAM平滑，但也很容易添加一个标准线性拟合:

```
ggplot(chic, aes(x = temp, y = death)) +
   labs(x = "Temperature (°F)", y = "Deaths") +
   stat_smooth(method = "lm", se = FALSE,
               color = "firebrick", size = 1.3) +
   geom_point(color = "gray40", alpha = .5)
```

![](https://picx.zhimg.com/v2-557ae5175196d24f310d410c41892cdb_1440w.jpg)

### 指定平滑公式

ggplot2允许你指定想要使用的模型。也许你想用多项式回归?

```
ggplot(chic, aes(x = o3, y = temp))+
  labs(x = "Ozone Level", y = "Temperature (°F)") +
  geom_smooth(
    method = "lm",
    formula = y ~ x + I(x^2) + I(x^3) + I(x^4) + I(x^5),
    color = "black",
    fill = "firebrick"
  ) +
  geom_point(color = "gray40", alpha = .3)
```

![](https://picx.zhimg.com/v2-3bba7f11a7dd99fdd251239da272212d_1440w.jpg)

或者假设你想要增加GAM的维度(添加一些额外的平滑摆动):

```
cols <- c("darkorange2", "firebrick", "dodgerblue3")

ggplot(chic, aes(x = date, y = temp)) +
  geom_point(color = "gray40", alpha = .3) +
  labs(x = "Year", y = "Temperature (°F)") +
  stat_smooth(aes(col = "1000"),
              method = "gam",
              formula = y ~ s(x, k = 1000),
              se = FALSE, size = 1.3) +
  stat_smooth(aes(col = "100"),
              method = "gam",
              formula = y ~ s(x, k = 100),
              se = FALSE, size = 1) +
  stat_smooth(aes(col = "10"),
              method = "gam",
              formula = y ~ s(x, k = 10),
              se = FALSE, size = .8) +
  scale_color_manual(name = "k", values = cols)
```

![](https://picx.zhimg.com/v2-f3a1d0cd0ea6b5b47fc2cd8f60cda68d_1440w.jpg)

## 做交互图

下面列出了一些库，这些库可以与{ggplot2}组合使用，也可以单独使用在R中做交互图(通常使用现有的JavaScript库)。

### 使用plotly和ggplot2

[http://poly.ly](https://link.zhihu.com/?target=http%3A//poly.ly)是一个创建在线、交互式图形和web应用程序的工具。plotly包可以让你直接从ggplot2图中创建这些主题，工作流程非常简单，可以在r中完成。然而，你的一些主题（theme）设置可能会被更改，之后需要手动修改。不太好的是，创建多面版图面（facet）可能不太容易。

```
g <- ggplot(chic, aes(date, temp)) +
  geom_line(color = "grey") +
  geom_point(aes(color = season)) +
  scale_color_brewer(palette = "Dark2", guide = "none") +
  labs(x = NULL, y = "Temperature (°F)") +
  theme_bw()
```

![](https://pica.zhimg.com/v2-6b7da2541f86da93192586201b2e3a76_1440w.jpg)

```
library(plotly)

ggplotly(g)
```

![](https://pica.zhimg.com/v2-6b7da2541f86da93192586201b2e3a76_1440w.jpg)

### ggiraph和ggplot2

ggiraph是一个R包，允许你创建动态的ggplot2图形。这允许你向图形添加工具提示、动画和JavaScript动作。当在Shiny应用程序中使用时，该包还允许选择图形元素：

```
library(ggiraph)

g <- ggplot(chic, aes(date, temp)) +
  geom_line(color = "grey") +
  geom_point_interactive(
    aes(color = season, tooltip = season, data_id = season)
  ) +
  scale_color_brewer(palette = "Dark2", guide = "none") +
  labs(x = NULL, y = "Temperature (°F)") +
  theme_bw()

girafe(ggobj = g)
```

![](https://picx.zhimg.com/v2-f73265d0c20dd0a9e8b8b7fb93eaf4e1_1440w.jpg)

### Highcharts

Apache ECharts是一个免费的、功能强大的图表和可视化库，提供了一种简单的方法来构建直观的、交互式的、高度可定制的图表。尽管它是用纯JavaScript编写的，但由于John Coene，我们可以通过echarts4r库在R中使用：

```
library(highcharter)

hchart(chic, "scatter", hcaes(x = date, y = temp, group = season))
```

![](https://pic4.zhimg.com/v2-88a139259d75318261b6b456222532ad_1440w.jpg)

### charter

charter是John Coene开发的另一个包，它支持在r中使用JavaScript可视化库。这个包允许你在Charts.js框架的帮助下构建交互式图形。

```
library(echarts4r)

chic %>%
  e_charts(date) %>%
  e_scatter(temp, symbol_size = 7) %>%
  e_visual_map(temp) %>%
  e_y_axis(name = "Temperature (°F)") %>%
  e_legend(FALSE)
```

![](https://pic3.zhimg.com/v2-d2764f37c60cbbb78bb18a27bef36b96_1440w.jpg)
