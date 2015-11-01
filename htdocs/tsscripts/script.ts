// sample_027
//
// WebGL縺ｧ繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧剃ｽｿ縺

onload = function(){
	// canvas繧ｨ繝ｬ繝｡繝ｳ繝医ｒ蜿門ｾ
	var c = document.getElementById('canvas');
	c.width = 512;
	c.height = 512;

	// webgl繧ｳ繝ｳ繝�く繧ｹ繝医ｒ蜿門ｾ
	var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

	// 鬆らせ繧ｷ繧ｧ繝ｼ繝縺ｨ繝輔Λ繧ｰ繝｡繝ｳ繝医す繧ｧ繝ｼ繝縲√�繝ｭ繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
	var v_shader = create_shader('vs');
	var f_shader = create_shader('fs');
	var prg = create_program(v_shader, f_shader);

	// attributeLocation繧帝�蛻励↓蜿門ｾ
	var attLocation = new Array();
	attLocation[0] = gl.getAttribLocation(prg, 'position');
	attLocation[1] = gl.getAttribLocation(prg, 'normal');
	attLocation[2] = gl.getAttribLocation(prg, 'color');
	attLocation[3] = gl.getAttribLocation(prg, 'textureCoord');

	// attribute縺ｮ隕∫ｴ謨ｰ繧帝�蛻励↓譬ｼ邏
	var attStride = new Array();
	attStride[0] = 3;
	attStride[1] = 3;
	attStride[2] = 4;
	attStride[3] = 2;

	// 繧ｭ繝･繝ｼ繝悶Δ繝�Ν
	var cubeData      = cube(2.0, [1.0, 1.0, 1.0, 1.0]);
	var cPosition     = create_vbo(cubeData.p);
	var cNormal       = create_vbo(cubeData.n);
	var cColor        = create_vbo(cubeData.c);
	var cTextureCoord = create_vbo(cubeData.t);
	var cVBOList      = [cPosition, cNormal, cColor, cTextureCoord];
	var cIndex        = create_ibo(cubeData.i);

	// 逅�ｽ薙Δ繝�Ν
	var earthData     = sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
	var ePosition     = create_vbo(earthData.p);
	var eNormal       = create_vbo(earthData.n);
	var eColor        = create_vbo(earthData.c);
	var eTextureCoord = create_vbo(earthData.t);
	var eVBOList      = [ePosition, eNormal, eColor, eTextureCoord];
	var eIndex        = create_ibo(earthData.i);

	// uniformLocation繧帝�蛻励↓蜿門ｾ
	var uniLocation = new Array();
	uniLocation[0] = gl.getUniformLocation(prg, 'mMatrix');
	uniLocation[1] = gl.getUniformLocation(prg, 'mvpMatrix');
	uniLocation[2] = gl.getUniformLocation(prg, 'invMatrix');
	uniLocation[3] = gl.getUniformLocation(prg, 'lightDirection');
	uniLocation[4] = gl.getUniformLocation(prg, 'useLight');
	uniLocation[5] = gl.getUniformLocation(prg, 'texture');

	// 蜷�ｨｮ陦悟�縺ｮ逕滓�縺ｨ蛻晄悄蛹
	var m = new matIV();
	var mMatrix   = m.identity(m.create());
	var vMatrix   = m.identity(m.create());
	var pMatrix   = m.identity(m.create());
	var tmpMatrix = m.identity(m.create());
	var mvpMatrix = m.identity(m.create());
	var invMatrix = m.identity(m.create());

	// 豺ｱ蠎ｦ繝�せ繝医ｒ譛牙柑縺ｫ縺吶ｋ
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// 繝�け繧ｹ繝√Ε髢｢騾｣
	var texture0 = null;
	var texture1 = null;
	create_texture('../images/texture0.png', 0);
	create_texture('../images/texture1.png', 1);
	gl.activeTexture(gl.TEXTURE0);

	// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧ｪ繝悶ず繧ｧ繧ｯ繝医�蜿門ｾ
	var fBufferWidth  = 512;
	var fBufferHeight = 512;
	var fBuffer = create_framebuffer(fBufferWidth, fBufferHeight);

	// 繧ｫ繧ｦ繝ｳ繧ｿ縺ｮ螳｣險
	var count = 0;

	// 諱貞ｸｸ繝ｫ繝ｼ繝
	(function(){
		// 繧ｫ繧ｦ繝ｳ繧ｿ繧偵う繝ｳ繧ｯ繝ｪ繝｡繝ｳ繝医☆繧
		count++;

		// 繧ｫ繧ｦ繝ｳ繧ｿ繧貞�縺ｫ繝ｩ繧ｸ繧｢繝ｳ繧堤ｮ怜�
		var rad  = (count % 360) * Math.PI / 180;
		var rad2 = (count % 720) * Math.PI / 360;

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧偵ヰ繧､繝ｳ繝
		gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer.f);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧貞�譛溷喧
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// 蝨ｰ逅�畑縺ｮVBO縺ｨIBO繧偵そ繝�ヨ
		set_attribute(eVBOList, attLocation, attStride);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eIndex);

		// 繝ｩ繧､繝磯未騾｣
		var lightDirection = [-1.0, 2.0, 1.0];

		// 繝薙Η繝ｼﾃ励�繝ｭ繧ｸ繧ｧ繧ｯ繧ｷ繝ｧ繝ｳ蠎ｧ讓吝､画鋤陦悟�
		m.lookAt([0.0, 0.0, 5.0], [0, 0, 0], [0, 1, 0], vMatrix);
		m.perspective(45, fBufferWidth / fBufferHeight, 0.1, 100, pMatrix);
		m.multiply(pMatrix, vMatrix, tmpMatrix);

		// 閭梧勹逕ｨ逅�ｽ薙ｒ繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｫ繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		m.identity(mMatrix);
		m.scale(mMatrix, [50.0, 50.0, 50.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		m.inverse(mMatrix, invMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mMatrix);
		gl.uniformMatrix4fv(uniLocation[1], false, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[2], false, invMatrix);
		gl.uniform3fv(uniLocation[3], lightDirection);
		gl.uniform1i(uniLocation[4], false);
		gl.uniform1i(uniLocation[5], 0);
		gl.drawElements(gl.TRIANGLES, earthData.i.length, gl.UNSIGNED_SHORT, 0);

		// 蝨ｰ逅�悽菴薙ｒ繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｫ繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ
		gl.bindTexture(gl.TEXTURE_2D, texture0);
		m.identity(mMatrix);
		m.rotate(mMatrix, rad, [0, 1, 0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		m.inverse(mMatrix, invMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mMatrix);
		gl.uniformMatrix4fv(uniLocation[1], false, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[2], false, invMatrix);
		gl.uniform1i(uniLocation[4], true);
		gl.drawElements(gl.TRIANGLES, earthData.i.length, gl.UNSIGNED_SHORT, 0);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｮ繝舌う繝ｳ繝峨ｒ隗｣髯､
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// canvas繧貞�譛溷喧
		gl.clearColor(0.0, 0.7, 0.7, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// 繧ｭ繝･繝ｼ繝悶�VBO縺ｨIBO繧偵そ繝�ヨ
		set_attribute(cVBOList, attLocation, attStride);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIndex);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｫ謠上″霎ｼ繧薙□蜀�ｮｹ繧偵ユ繧ｯ繧ｹ繝√Ε縺ｨ縺励※驕ｩ逕ｨ
		gl.bindTexture(gl.TEXTURE_2D, fBuffer.t);

		// 繝ｩ繧､繝磯未騾｣
		lightDirection = [-1.0, 0.0, 0.0];

		// 繝薙Η繝ｼﾃ励�繝ｭ繧ｸ繧ｧ繧ｯ繧ｷ繝ｧ繝ｳ蠎ｧ讓吝､画鋤陦悟�
		m.lookAt([0.0, 0.0, 5.0], [0, 0, 0], [0, 1, 0], vMatrix);
		m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
		m.multiply(pMatrix, vMatrix, tmpMatrix);

		// 繧ｭ繝･繝ｼ繝悶ｒ繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ
		m.identity(mMatrix);
		m.rotate(mMatrix, rad2, [1, 1, 0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		m.inverse(mMatrix, invMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mMatrix);
		gl.uniformMatrix4fv(uniLocation[1], false, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[2], false, invMatrix);
		gl.drawElements(gl.TRIANGLES, cubeData.i.length, gl.UNSIGNED_SHORT, 0);

		// 繧ｳ繝ｳ繝�く繧ｹ繝医�蜀肴緒逕ｻ
		gl.flush();

		// 繝ｫ繝ｼ繝励�縺溘ａ縺ｫ蜀榊ｸｰ蜻ｼ縺ｳ蜃ｺ縺
		setTimeout(arguments.callee, 1000 / 30);
	})();

	// 繧ｷ繧ｧ繝ｼ繝繧堤函謌舌☆繧矩未謨ｰ
	function create_shader(id){
		// 繧ｷ繧ｧ繝ｼ繝繧呈ｼ邏阪☆繧句､画焚
		var shader;

		// HTML縺九ｉscript繧ｿ繧ｰ縺ｸ縺ｮ蜿ら�繧貞叙蠕
		var scriptElement = document.getElementById(id);

		// script繧ｿ繧ｰ縺悟ｭ伜惠縺励↑縺�ｴ蜷医�謚懊￠繧
		if(!scriptElement){return;}

		// script繧ｿ繧ｰ縺ｮtype螻樊ｧ繧偵メ繧ｧ繝�け
		switch(scriptElement.type){

			// 鬆らせ繧ｷ繧ｧ繝ｼ繝縺ｮ蝣ｴ蜷
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;

			// 繝輔Λ繧ｰ繝｡繝ｳ繝医す繧ｧ繝ｼ繝縺ｮ蝣ｴ蜷
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default :
				return;
		}

		// 逕滓�縺輔ｌ縺溘す繧ｧ繝ｼ繝縺ｫ繧ｽ繝ｼ繧ｹ繧貞牡繧雁ｽ薙※繧
		gl.shaderSource(shader, scriptElement.text);

		// 繧ｷ繧ｧ繝ｼ繝繧偵さ繝ｳ繝代う繝ｫ縺吶ｋ
		gl.compileShader(shader);

		// 繧ｷ繧ｧ繝ｼ繝縺梧ｭ｣縺励￥繧ｳ繝ｳ繝代う繝ｫ縺輔ｌ縺溘°繝√ぉ繝�け
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){

			// 謌仙粥縺励※縺�◆繧峨す繧ｧ繝ｼ繝繧定ｿ斐＠縺ｦ邨ゆｺ
			return shader;
		}else{

			// 螟ｱ謨励＠縺ｦ縺�◆繧峨お繝ｩ繝ｼ繝ｭ繧ｰ繧偵い繝ｩ繝ｼ繝医☆繧
			alert(gl.getShaderInfoLog(shader));
		}
	}

	// 繝励Ο繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ逕滓�縺励す繧ｧ繝ｼ繝繧偵Μ繝ｳ繧ｯ縺吶ｋ髢｢謨ｰ
	function create_program(vs, fs){
		// 繝励Ο繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
		var program = gl.createProgram();

		// 繝励Ο繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医↓繧ｷ繧ｧ繝ｼ繝繧貞牡繧雁ｽ薙※繧
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);

		// 繧ｷ繧ｧ繝ｼ繝繧偵Μ繝ｳ繧ｯ
		gl.linkProgram(program);

		// 繧ｷ繧ｧ繝ｼ繝縺ｮ繝ｪ繝ｳ繧ｯ縺梧ｭ｣縺励￥陦後↑繧上ｌ縺溘°繝√ぉ繝�け
		if(gl.getProgramParameter(program, gl.LINK_STATUS)){

			// 謌仙粥縺励※縺�◆繧峨�繝ｭ繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ譛牙柑縺ｫ縺吶ｋ
			gl.useProgram(program);

			// 繝励Ο繧ｰ繝ｩ繝繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ霑斐＠縺ｦ邨ゆｺ
			return program;
		}else{

			// 螟ｱ謨励＠縺ｦ縺�◆繧峨お繝ｩ繝ｼ繝ｭ繧ｰ繧偵い繝ｩ繝ｼ繝医☆繧
			alert(gl.getProgramInfoLog(program));
		}
	}

	// VBO繧堤函謌舌☆繧矩未謨ｰ
	function create_vbo(data){
		// 繝舌ャ繝輔ぃ繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
		var vbo = gl.createBuffer();

		// 繝舌ャ繝輔ぃ繧偵ヰ繧､繝ｳ繝峨☆繧
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

		// 繝舌ャ繝輔ぃ縺ｫ繝��繧ｿ繧偵そ繝�ヨ
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

		// 繝舌ャ繝輔ぃ縺ｮ繝舌う繝ｳ繝峨ｒ辟｡蜉ｹ蛹
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// 逕滓�縺励◆ VBO 繧定ｿ斐＠縺ｦ邨ゆｺ
		return vbo;
	}

	// VBO繧偵ヰ繧､繝ｳ繝峨＠逋ｻ骭ｲ縺吶ｋ髢｢謨ｰ
	function set_attribute(vbo, attL, attS){
		// 蠑墓焚縺ｨ縺励※蜿励￠蜿悶▲縺滄�蛻励ｒ蜃ｦ逅�☆繧
		for(var i in vbo){
			// 繝舌ャ繝輔ぃ繧偵ヰ繧､繝ｳ繝峨☆繧
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

			// attributeLocation繧呈怏蜉ｹ縺ｫ縺吶ｋ
			gl.enableVertexAttribArray(attL[i]);

			// attributeLocation繧帝夂衍縺礼匳骭ｲ縺吶ｋ
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}

	// IBO繧堤函謌舌☆繧矩未謨ｰ
	function create_ibo(data){
		// 繝舌ャ繝輔ぃ繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
		var ibo = gl.createBuffer();

		// 繝舌ャ繝輔ぃ繧偵ヰ繧､繝ｳ繝峨☆繧
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

		// 繝舌ャ繝輔ぃ縺ｫ繝��繧ｿ繧偵そ繝�ヨ
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

		// 繝舌ャ繝輔ぃ縺ｮ繝舌う繝ｳ繝峨ｒ辟｡蜉ｹ蛹
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// 逕滓�縺励◆IBO繧定ｿ斐＠縺ｦ邨ゆｺ
		return ibo;
	}

	// 繝�け繧ｹ繝√Ε繧堤函謌舌☆繧矩未謨ｰ
	function create_texture(source, number){
		// 繧､繝｡繝ｼ繧ｸ繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
		var img = new Image();

		// 繝��繧ｿ縺ｮ繧ｪ繝ｳ繝ｭ繝ｼ繝峨ｒ繝医Μ繧ｬ繝ｼ縺ｫ縺吶ｋ
		img.onload = function(){
			// 繝�け繧ｹ繝√Ε繧ｪ繝悶ず繧ｧ繧ｯ繝医�逕滓�
			var tex = gl.createTexture();

			// 繝�け繧ｹ繝√Ε繧偵ヰ繧､繝ｳ繝峨☆繧
			gl.bindTexture(gl.TEXTURE_2D, tex);

			// 繝�け繧ｹ繝√Ε縺ｸ繧､繝｡繝ｼ繧ｸ繧帝←逕ｨ
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

			// 繝溘ャ繝励�繝��繧堤函謌
			gl.generateMipmap(gl.TEXTURE_2D);

			// 繝�け繧ｹ繝√Ε繝代Λ繝｡繝ｼ繧ｿ縺ｮ險ｭ螳
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

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

			// 繝�け繧ｹ繝√Ε縺ｮ繝舌う繝ｳ繝峨ｒ辟｡蜉ｹ蛹
			gl.bindTexture(gl.TEXTURE_2D, null);
		};

		// 繧､繝｡繝ｼ繧ｸ繧ｪ繝悶ず繧ｧ繧ｯ繝医�繧ｽ繝ｼ繧ｹ繧呈欠螳
		img.src = source;
	}

	// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧偵が繝悶ず繧ｧ繧ｯ繝医→縺励※逕滓�縺吶ｋ髢｢謨ｰ
	function create_framebuffer(width, height){
		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｮ逕滓�
		var frameBuffer = gl.createFramebuffer();

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ繧淡ebGL縺ｫ繝舌う繝ｳ繝
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

		// 豺ｱ蠎ｦ繝舌ャ繝輔ぃ逕ｨ繝ｬ繝ｳ繝繝ｼ繝舌ャ繝輔ぃ縺ｮ逕滓�縺ｨ繝舌う繝ｳ繝
		var depthRenderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);

		// 繝ｬ繝ｳ繝繝ｼ繝舌ャ繝輔ぃ繧呈ｷｱ蠎ｦ繝舌ャ繝輔ぃ縺ｨ縺励※險ｭ螳
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｫ繝ｬ繝ｳ繝繝ｼ繝舌ャ繝輔ぃ繧帝未騾｣莉倥￠繧
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ逕ｨ繝�け繧ｹ繝√Ε縺ｮ逕滓�
		var fTexture = gl.createTexture();

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ逕ｨ縺ｮ繝�け繧ｹ繝√Ε繧偵ヰ繧､繝ｳ繝
		gl.bindTexture(gl.TEXTURE_2D, fTexture);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ逕ｨ縺ｮ繝�け繧ｹ繝√Ε縺ｫ繧ｫ繝ｩ繝ｼ逕ｨ縺ｮ繝｡繝｢繝ｪ鬆伜沺繧堤｢ｺ菫
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		// 繝�け繧ｹ繝√Ε繝代Λ繝｡繝ｼ繧ｿ
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		// 繝輔Ξ繝ｼ繝繝舌ャ繝輔ぃ縺ｫ繝�け繧ｹ繝√Ε繧帝未騾｣莉倥￠繧
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);

		// 蜷�ｨｮ繧ｪ繝悶ず繧ｧ繧ｯ繝医�繝舌う繝ｳ繝峨ｒ隗｣髯､
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// 繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ霑斐＠縺ｦ邨ゆｺ
		return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
	}

};
