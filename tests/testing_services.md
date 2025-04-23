### Performance & Stability Testing: Tool Selection

#### 1. **System Resource Monitoring**
- **Glances**  
  Easy CLI/web tool. Auto-logs to file with `-o` argument.  
  `glances -o glances.log`

#### 2. **HTTP & Service Load Testing**
- **ApacheBench (`ab`)**  
  Simple install, easy concurrency/load test, outputs to file.  
  `ab -n 1000 -c 50 http://localhost/ > ab_results.txt`

#### 3. **Network Bandwidth**
- **iperf3**  
  Run server on one device, client on another, auto-logs to console.  
  Server: `iperf3 -s`, Client: `iperf3 -c <server-ip> > iperf3_results.txt`

#### 4. **CPU and Disk Stress**
- **stress**  
  Simple resource stress testing, log resource metrics via `glances` in parallel.  
  `stress --cpu 2 --io 2 --vm 2 --vm-bytes 128M --timeout 60s`

#### 5. **Power Measurement**
- **Wattmeter device**  
  Physical device for direct wall power draw (manual record results).
