/*
  *图表详情页
  *zhzhliu 2018-05-21
*/
import React ,{Component} from 'react'
import {Popover,Modal,Icon} from 'antd'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
import './index.scss'
import ChartModal from "./../../components/ChartModal"
import XLSX from 'xlsx'
class AbcCandlechart extends Component{
    constructor(props){
        super(props)
        this.state={
            showImageSetting:false,
            installconfig:this.props.modalData.data.config,
            chartData:this.props.chartData
        }
    }
    
    exportHandle = () => {
         //导出image隐藏图表导出弹出框
         this.setState({
            showImageSetting:false
         })
     }

     downloadData = () => {
      let {installconfig ,chartData} = this.state;
      let downloadData =  this.getImageText(installconfig);
      this.downloadExcel(chartData.chartTitle,downloadData);
   }
    /**
   * 表格信息提取
   */
    getImageText(chartConf) {
       let tableArr = [];
       let series = chartConf.series||[];
       if(series.length <1){
           return tableArr;
       }
       let arr = series[0].data;
       let firstArr = [];
       firstArr.push(chartConf.xAxis.type);
       firstArr.push(series[0].name);
       tableArr.push(firstArr);
       for (let i in arr){
           let eleArr = [];
           for (let j in arr[i]){
               eleArr.push(arr[i][j]);
           }
           tableArr.push(eleArr);
       }
       for (let i =1; i < series.length;i++){
           if(series[i-1].type === 'candlestick'){
                 // console.log(series[i].name);
                  tableArr[0].push(null,null,null,series[i].name);
                  for (let j =0;j< series[i].data.length; j++){
                   let eleArr = series[i].data[j];
                   if (eleArr.length < 2){
                      tableArr[j+1].push("");
                   }
                   else{
                      tableArr[j+1].push(eleArr[1]);
                   }
               }
           }else{
               tableArr[0].push(series[i].name);
              for (let j =0;j< series[i].data.length; j++){
              let eleArr = series[i].data[j];
              if (eleArr.length < 2){
                  tableArr[j+1].push("");
              }
              else{
                  tableArr[j+1].push(eleArr[1]);
              }
          }
        }
      }
      return  tableArr;
   }
  /**
   * 下载表格
   */
   downloadExcel(name,data){
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile( wb, name + '.xlsx');
  }

    render(){  
          const { installconfig ,chartData} = this.state;
          installconfig['title']= {
            text: ''
          }
          const content = (
            <div className="selectbox">
              <p className="select-p" onClick={this.downloadData}>导出数据</p>
              <p className="select-p" onClick={() => {this.setState({showImageSetting:true})}}>导出图片</p>
            </div>
          )

        return( 
          <div className="detail-chart">
             <div className="detail-chart-head">
               <div className="iresearch-detail-trend-update">
                 <span>{chartData.update.text}</span>
                 <span>更新</span>
               </div>
               <div className="detail-trend-set">
                 <Popover content={content} trigger="hover" placement="bottom" overlayClassName="selectList">
                 <Icon type="menu-unfold" className='icon'/>
                 </Popover>
               </div>
             </div>
            
             <div className="iresearch-detail-trend-chartContainer">
               <ReactHighstock config={this.props.chartData.data.config}></ReactHighstock>
             </div>
    
            {/* 图表导出模块 */}
             <Modal title='导出设置' width={826} height={600} footer={null}
                    visible={this.state.showImageSetting}
                    onCancel={() => this.setState({showImageSetting: false})}
                    className="detail-chart-modal">
                 <ChartModal installconfig={this.state.installconfig} exports={this.exportHandle}/>
             </Modal>
          </div>
        )
    }
}
export default AbcCandlechart