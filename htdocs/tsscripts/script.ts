onload = function(){

    // canvasを設定
    var c = document.getElementById('canvas');

    c.width = 512;
    c.height = 512;

    // webglコンテキストを取得
    var gl = c.getContext('webgl' || c.getContext('experimental-webgl'));

    // 頂点シェーダとフラグメントシェーダの生成
    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');

    // プログラムオブジェクトの生成とリンク
    var prg = create_program(v_shader, f_shader);

    // attributeLocationを配列に取得
    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'normal');
    attLocation[2] = gl.getAttribLocation(prg, 'color');
    attLocation[3] = gl.getAttribLocation(prg, 'textureCoord');

    // attributeの要素数を配列に格納
    var attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 3;
    attStride[2] = 4;
    attStride[3] = 2;

    // キューブ
    var cubeData = cube(2.0,[1.0,1.0,1.0,1.0]);
    var cPosition = create_vbo(cubeData.p);
    var cNormal = create_vbo(cubeData.n);
    var cColor = create_vbo(cubeData.c);
    var cTextureCoord = create_vbo(cubeData.t);
    var cVBOList = [cPosition,cNormal,cColor,cTextureCoord];
    var cIndex = create_ibo(cubeData.i);


    // スフィア
    var earthData = sphere(64,64,1.0,[1.0,1.0,1.0,1.0]);
    var ePosition = create_vbo(earthData.p);
    var eNormal = create_vbo(earthData.n);
    var eColor = create_vbo(earthData.c);
    var eTextureCoord = create_vbo(earthData.t);
    var eVBOList = [ePosition,eNormal,eColor,eTextureCoord];
    var eIndex = create_ibo(earthData.i);


    // uniformLocationを配列に取得
    var uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg,'mMatrix');
    uniLocation[1] = gl.getUniformLocation(prg,'mvpMatrix');
    uniLocation[2] = gl.getUniformLocation(prg,'invMatrix');
    uniLocation[3] = gl.getUniformLocation(prg,'lightDirection');
    uniLocation[4] = gl.getUniformLocation(prg,'useLight');
    uniLocation[5] = gl.getUniformLocation(prg,'texture');

    //カリング
    //gl.enable(gl.CULL_FACE);

    var m = new matIV();
  	var mMatrix   = m.identity(m.create());
  	var vMatrix   = m.identity(m.create());
  	var pMatrix   = m.identity(m.create());
  	var tmpMatrix = m.identity(m.create());
  	var mvpMatrix = m.identity(m.create());
  	var invMatrix = m.identity(m.create());
    var qMatrix   = m.identity(m.create());

    // カウンタの宣言
    var count = 0;

    gl.enable(gl.DEPTH_TEST);
  	gl.depthFunc(gl.LEQUAL);

    // テクスチャの用意
    var texture0 = null;
    var texture1 = null;
    create_texture('../images/texture0.png',0);
    create_texture('../images/texture1.png',1);
    gl.activeTexture(gl.TEXTURE0);

    var fBufferWidth = 512;
    var fBufferHeight = 512;
    var fBuffer = create_framebuffer(fBufferWidth,fBufferHeight);

    // 恒常ループ
    (() => {
        // canvasを初期化
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        count++;
        var rad = (count % 360) * Math.PI / 180;
        var rad2 = (count % 720) * Math.PI / 360;

        gl.bindFramebuffer(gl.FRAMEBUFFER,fBuffer.f);

        set_attribute(eVBOList,attLocation,attStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,eIndex);

        var lightDirection = [-1.0,2.0,1.0];

        m.lookAt([0.0,0.0,5.0],[0,0,0],[0,1,0],vMatrix);
        m.perspective(45,fBufferWidth / fBufferHeight,0.1,100,pMatrix);
        m.multiply(pMatrix,vMatrix,tmpMatrix);

        gl.bindTexture(gl.TEXTURE_2D,texture1);
        m.identity(mMatrix);
        m.scale(mMatrix,[50.0,50.0,50.0],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        m.inverse(mMatrix,invMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mMatrix);
        gl.uniformMatrix4fv(uniLocation[1],false,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[2],false,invMatrix);
        gl.uniform3fv(uniLocation[3],lightDirection);
        gl.uniform1i(uniLocation[4],false);
        gl.uniform1i(uniLocation[5],0);
        gl.drawElements(gl.TRIANGLES,earthData.i.length,gl.UNSIGNED_SHORT,0);

        gl.bindTexture(gl.TEXTURE_2D,texture0);
        m.identity(mMatrix);
        m.rotate(mMatrix,rad,[0,1,0],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        m.inverse(mMatrix,invMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mMatrix);
        gl.uniformMatrix4fv(uniLocation[1],false,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[2],false,invMatrix);
        gl.uniform1i(uniLocation[4],true);
        gl.drawElements(gl.TRIANGLES,earthData.i.length,gl.UNSIGNED_SHORT,0);

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        gl.clearColor(0.0,0.7,0.7,1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        set_attribute(cVBOList,attLocation,attStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cIndex);

        gl.bindTexture(gl.TEXTURE_2D,fBuffer.t);

        lightDirection = [-1.0,0.0,0.0];

        m.lookAt([0.0,0.0,5.0],[0,0,0],[0,1,0],vMatrix);
        m.perspective(45,c.width/c.height,0.1,100,pMatrix);
        m.multiply(pMatrix,vMatrix,tmpMatrix);

        m.identity(mMatrix);
        m.rotate(mMatrix,rad2,[1,1,0],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        m.inverse(mMatrix,invMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mMatrix);
        gl.uniformMatrix4fv(uniLocation[1],false,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[2],false,invMatrix);
        gl.drawElements(gl.TRIANGLES,cubeData.i.length,gl.UNSIGNED_SHORT,0);

        // コンテキストの再描画
        gl.flush();

        // ループのために再帰呼び出し
        setTimeout(arguments.callee, 1000 / 30);
    })();

    // シェーダを生成する関数
    function create_shader(id){
        // シェーダを格納する変数
        var shader;

        // HTMLからscriptタグへの参照を取得
        var scriptElement = document.getElementById(id);

        // scriptタグが存在しない場合は抜ける
        if(!scriptElement){return;}

        // scriptタグのtype属性をチェック
        switch(scriptElement.type){

            // 頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;

            // フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }

        // 生成されたシェーダにソースを割り当てる
        gl.shaderSource(shader, scriptElement.text);

        // シェーダをコンパイルする
        gl.compileShader(shader);

        // シェーダが正しくコンパイルされたかチェック
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){

            // 成功していたらシェーダを返して終了
            return shader;
        }else{

            // 失敗していたらエラーログをアラートする
            alert(gl.getShaderInfoLog(shader));
        }
    }

    // プログラムオブジェクトを生成しシェーダをリンクする関数
    function create_program(vs, fs){
        // プログラムオブジェクトの生成
        var program = gl.createProgram();

        // プログラムオブジェクトにシェーダを割り当てる
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        // シェーダをリンク
        gl.linkProgram(program);

        // シェーダのリンクが正しく行なわれたかチェック
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){

            // 成功していたらプログラムオブジェクトを有効にする
            gl.useProgram(program);

            // プログラムオブジェクトを返して終了
            return program;
        }else{

            // 失敗していたらエラーログをアラートする
            alert(gl.getProgramInfoLog(program));
        }
    }

    // VBOを生成する関数
    function create_vbo(data){
        // バッファオブジェクトの生成
        var vbo = gl.createBuffer();

        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

        // バッファにデータをセット
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        // バッファのバインドを無効化
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // 生成した VBO を返して終了
        return vbo;
    }

    // VBOをバインドし登録する関数
    function set_attribute(vbo, attL, attS){
        // 引数として受け取った配列を処理する
        for(var i in vbo){
            // バッファをバインドする
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

            // attributeLocationを有効にする
            gl.enableVertexAttribArray(attL[i]);

            // attributeLocationを通知し登録する
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }

    // IBOを生成する関数
    function create_ibo(data){
        // バッファオブジェクトの生成
        var ibo = gl.createBuffer();

        // バッファをバインドする
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

        // バッファにデータをセット
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

        // バッファのバインドを無効化
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // 生成したIBOを返して終了
        return ibo;
    }

    function create_texture(source,number){
      var img = new Image();

      img.onload = function(){
        var tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D,tex);

        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);

        gl.generateMipmap(gl.TEXTURE_2D);

        switch(number){
          case 0:
            texture0 = tex;
            break;
          case 1:
            texture1 = tex;
            break;
          default:
            break;
        }

        gl.bindTexture(gl.TEXTURE_2D,null);

      }
      img.src = source;
    }

    function create_framebuffer(width,height){
      // フレームバッファの生成
      var frameBuffer = gl.createFramebuffer();

      // フレームバッファをwebGLにバインド
      gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);

      // 深度バッファ用レンダーバッファの生成とバインド
      var depthRenderBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER,depthRenderBuffer);

      // レンダーバッファを深度バッファとして設定
      gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);

      // フレームバッファにレンダーバッファを関連付ける
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthRenderBuffer);

      // フレームバッファ用テクスチャの生成
      var fTexture = gl.createTexture();

      // フレームバッファ用のテクスチャをバインド
      gl.bindTexture(gl.TEXTURE_2D,fTexture);

      // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);

      // テクスチャパラメータ
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);

      // フレームバッファにテクスチャを関連付ける
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,fTexture,0);

      // 各種オブジェクトのバインドを解除
      gl.bindTexture(gl.TEXTURE_2D,null);
      gl.bindRenderbuffer(gl.RENDERBUFFER,null);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);

      // オブジェクトを返して終了
      return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
    }

};
