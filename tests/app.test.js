/* Kiểm thử hồi quy cho js/app.js – mở tests/index.html qua máy chủ tĩnh (vd: python3 -m http.server) */
(function(){
const out=[];let pass=0,fail=0;
const t=(name,fn)=>{try{fn();pass++;out.push(['p','✔ '+name])}catch(e){fail++;out.push(['f','✖ '+name+' – '+e.message])}};
const eq=(a,b,m='')=>{if(a!==b)throw new Error(m+' kỳ vọng '+JSON.stringify(b)+', nhận '+JSON.stringify(a))};
const ok=(v,m)=>{if(!v)throw new Error(m||'điều kiện sai')};
const MIN=6e4,snapS=JSON.stringify({sess:S.sess,lots:S.lots,pays:S.pays,prices:S.prices,sur:S.sur,users:S.users,exc:S.exc});
const reset=()=>{const o=JSON.parse(snapS);Object.assign(S,o);S.rcN=102;cs=null;me=S.users.find(u=>u.u=='admin');inR=null;outR=null;cm();document.querySelectorAll('.mo').forEach(m=>m.remove())};
const sess=(o)=>{const s=Object.assign({id:'PH-T'+Math.random().toString(36).slice(2,6),plate:'51C-123.45',lot:'LH-2601',type:TYPES[0],inAt:now()-30*MIN,st:'Đang đỗ',paid:0,due:0,ch:''},o);S.sess.push(s);return s};
me=S.users.find(u=>u.u=='admin');

/* ---- Công thức tính phí (đối chiếu bảng giá mặc định + phụ phí mái che >180 phút) ---- */
t('Phí xe tải nhỏ 30 phút = 15.000 đ',()=>eq(feeOf({type:TYPES[0],inAt:now()-30*MIN}).tot,15000));
t('Phí làm tròn lên theo phút: 30 giây tính 1 phút',()=>{const f=feeOf({type:TYPES[0],inAt:now()-30e3});eq(f.m,1);eq(f.tot,15000)});
t('Mốc 60 phút chuyển sang khung 60–180',()=>eq(feeOf({type:TYPES[0],inAt:0},60*MIN).tot,40000));
t('Đúng 180 phút: chưa cộng phụ phí',()=>eq(feeOf({type:TYPES[0],inAt:0},180*MIN).tot,80000));
t('181 phút: cộng phụ phí mái che 50.000 đ',()=>eq(feeOf({type:TYPES[0],inAt:0},181*MIN).tot,130000));
t('Xe container 13 giờ: khung cuối 280.000 + 50.000',()=>eq(feeOf({type:TYPES[2],inAt:0},780*MIN).tot,330000));
t('Thiếu khung giá: gắn cờ np thay vì miễn phí âm thầm',()=>{reset();S.prices=S.prices.filter(p=>p.type!=TYPES[1]);ok(feeOf({type:TYPES[1],inAt:0},30*MIN).np)});

/* ---- Thu ngân ---- */
t('Thu tiền mặt: ghi 1 biên lai, phiên chuyển Đã thanh toán',()=>{reset();const s=sess();cs=s.id;S.tab='Cash';go('pay');$('#cash').value='20000';cashPay(s.id,15000);eq(s.st,'Đã thanh toán');eq(s.paid,15000);const p=S.pays.filter(x=>x.id==s.id);eq(p.length,1);eq(p[0].amt,15000);eq(p[0].ch,'Tiền mặt')});
t('Thu tiền mặt thiếu bị từ chối',()=>{reset();const s=sess();cs=s.id;S.tab='Cash';go('pay');$('#cash').value='10000';cashPay(s.id,15000);eq(s.st,'Đang đỗ');eq(S.pays.filter(x=>x.id==s.id).length,0)});
t('Số tiền trên màn hình đã cũ (phí tăng) thì không thu',()=>{reset();const s=sess({inAt:now()-61*MIN});cs=s.id;S.tab='Cash';go('pay');$('#cash').value='100000';cashPay(s.id,15000);eq(s.st,'Đang đỗ');eq(S.pays.filter(x=>x.id==s.id).length,0)});
t('QR thành công ghi đúng số tiền còn lại',()=>{reset();const s=sess();bank(s.id,1,15000);eq(s.paid,15000);eq(S.pays.filter(x=>x.id==s.id)[0].ch,'QR')});
t('Thu bổ sung khi quá hạn: giữ cả 2 biên lai, tổng khớp phí',()=>{reset();const s=sess({inAt:now()-200*MIN,payAt:now()-20*MIN,paid:80000,due:80000,st:'Đã thanh toán',rc:'BL-0009',ch:'QR'});S.pays.push({rc:'BL-0009',id:s.id,plate:s.plate,lot:s.lot,inAt:s.inAt,t:s.payAt,amt:80000,ch:'QR'});eq(owe(s),50000,'nợ phát sinh');s.st='Đang đỗ';bank(s.id,1,50000);const p=S.pays.filter(x=>x.id==s.id);eq(p.length,2);eq(p.reduce((a,x)=>a+x.amt,0),130000);eq(s.paid,130000);eq(owe(s),0)});
t('Trong 15 phút sau thanh toán không phát sinh phí',()=>{reset();const s=sess({inAt:now()-50*MIN,payAt:now()-5*MIN,paid:15000,st:'Đã thanh toán'});eq(owe(s),0)});
t('Phiên đã đóng ở quầy không hiện "Invalid Date"',()=>{reset();const s=sess({st:'Đã đóng',outAt:now(),exOut:true,debt:15000});cs=s.id;go('pay');ok(!$('#app').innerHTML.includes('Invalid'),'có Invalid Date')});
t('Biên lai in lại hiển thị số tiền của lần thu đó',()=>{reset();const s=sess();bank(s.id,1,15000);cm();receipt(s.id);const r=document.querySelector('.mo:not(.out) .rc').textContent;ok(r.includes('15.000'),r)});

/* ---- Lane vào / lane ra ---- */
t('Lane ra đóng đúng lô của phiên khi xe có lô mới cùng biển số',()=>{reset();const L1=S.lots.find(l=>l.id=='LH-2601');L1.used=true;S.lots.push({id:'LH-9001',plate:L1.plate,type:L1.type,ex:1,reg:1,driver:'A',owner:'B'});eq(lotBy(L1.plate).id,'LH-9001','lotBy ưu tiên lô chưa nhận');const s=sess({plate:L1.plate,lot:'LH-9001',payAt:now()-1*MIN,paid:15000,st:'Đã thanh toán'});go('out');$('#op').value=s.plate;scanOut();eq(s.st,'Đã đóng');ok(S.lots.find(l=>l.id=='LH-9001').used,'lô mới phải được đánh dấu')});
t('Lane ra giữ barrier khi chưa có khung giá',()=>{reset();const s=sess({type:TYPES[1],plate:'60C-555.12',lot:'LH-2603'});S.prices=S.prices.filter(p=>p.type!=TYPES[1]);go('out');$('#op').value=s.plate;scanOut();eq(s.st,'Đang đỗ')});
t('Lane vào: lô hợp lệ tạo phiên mới',()=>{reset();const n=S.sess.length;go('in');$('#ip').value='51C-123.45';scanIn();eq(S.sess.length,n+1);eq(S.sess[n].lot,'LH-2601')});
t('Lane vào: lô chưa xuất kho không tạo phiên',()=>{reset();const n=S.sess.length;go('in');$('#ip').value='60C-555.12';scanIn();eq(S.sess.length,n)});

/* ---- Lịch sử: lọc ngày theo giờ địa phương ---- */
t('Lọc ngày dùng giờ địa phương (xe vào 00:30)',()=>{reset();const d=new Date();d.setHours(0,30,0,0);const ds=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');sess({plate:'99Z-000.01',inAt:d.getTime()});hf={q:'99Z',a:ds,b:ds,k:'',g:''};go('hist');ok($('#app').innerHTML.includes('99Z-000.01'),'không thấy phiên');hf={q:'',a:'',b:'',k:'',g:''}});

/* ---- Kiểm tra dữ liệu nhập ---- */
t('esc() vô hiệu hóa thẻ HTML',()=>{const v=esc('<img src=x onerror="a()">');ok(!/[<>"]/.test(v),v)});
t('Lý do mở thủ công chứa HTML được hiển thị dạng chữ',()=>{reset();go('in');manual('51C-123.45','vào');$('#mw').value='<b id="xss">x</b>';doManual('51C-123.45','vào');go('hist');ok(!document.getElementById('xss'),'HTML bị thực thi')});
t('Đăng ký nhận hàng từ chối biển số sai định dạng',()=>{reset();const n=S.lots.length;recvE(-1);$('#rp').value="x');alert(1);//";svR(-1);eq(S.lots.length,n);cm()});
t('Đăng ký nhận hàng hợp lệ: mã lô không trùng',()=>{reset();recvE(-1);$('#rp').value='51c-999.88';$('#rd').value='Tài xế';svR(-1);const l=S.lots[S.lots.length-1];eq(l.plate,'51C-999.88');eq(new Set(S.lots.map(x=>x.id)).size,S.lots.length)});
t('Không cho tạo tên đăng nhập trùng',()=>{reset();const n=S.users.length;edU();$('#un').value='admin';$('#uf').value='X';svU();eq(S.users.length,n);cm()});
t('Không khóa tài khoản đang đăng nhập',()=>{reset();lkU(S.users.indexOf(me));eq(me.on,1)});
t('Bảng giá: chặn khung chồng lấn',()=>{reset();const n=S.prices.length;edP();$('#pt').value=TYPES[0];$('#pf').value='30';$('#pto').value='90';$('#pp').value='1000';svP(-1,'BG-X');eq(S.prices.length,n);cm()});
t('Bảng giá: chặn giá âm / trống',()=>{reset();edP(0);$('#pp').value='-5';svP(0,S.prices[0].id);eq(S.prices[0].price,15000);cm()});
t('Phụ phí: chặn giá trị trống',()=>{reset();const n=S.sur.length;edS();$('#sn').value='Test';$('#sf').value='';svS();eq(S.sur.length,n);cm()});
t('Biểu đồ không sinh NaN khi dữ liệu rỗng hoặc bằng 0',()=>{ok(!bars([['a',0],['b',0]]).includes('NaN'));eq(bars([]),'')});

/* ---- Render toàn bộ màn hình với quyền quản trị: không lỗi, không NaN/undefined ---- */
t('Mọi màn hình render không lỗi, không NaN/undefined',()=>{reset();ALL.concat('dash').forEach(k=>{go(k);const h=$('#app').innerHTML;ok(!/NaN|undefined|Invalid Date/.test(h),k+' chứa giá trị lỗi')})});

reset();me=null;
const el=document.getElementById('results');el.innerHTML=`<b>${pass} đạt · ${fail} lỗi</b><br>`+out.map(([c,m])=>`<div class="${c}">${esc(m)}</div>`).join('');
window.__testResult={pass,fail,fails:out.filter(x=>x[0]=='f').map(x=>x[1])};console.log('TESTS',pass,'pass',fail,'fail');
})();
